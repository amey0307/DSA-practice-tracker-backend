import { Webhook } from "svix"
import dotenv from 'dotenv'

dotenv.config()

//clerk webhook
export const webhook = async (req: any, res: any) => {
    const SIGNING_SECRET = process.env.SIGNING_SECRET

    if (!SIGNING_SECRET) {
        throw new Error('Error: Please add SIGNING_SECRET from Clerk Dashboard to .env')
    }

    const wh = new Webhook(SIGNING_SECRET)

    const headers = req.headers
    const payload = req.body

    const svix_id = headers['svix-id']
    const svix_timestamp = headers['svix-timestamp']
    const svix_signature = headers['svix-signature']

    if (!svix_id || !svix_timestamp || !svix_signature) {
        return void res.status(400).json({
            success: false,
            message: 'Error: Missing svix headers',
        })
    }

    let evt: any;

    try {
        evt = wh.verify(payload, {
            'svix-id': svix_id,
            'svix-timestamp': svix_timestamp,
            'svix-signature': svix_signature,
        })
    } catch (err: any) {
        console.log('Error: Could not verify webhook:', err.message)
        return void res.status(400).json({
            success: false,
            message: err.message,
        })
    }

    const { id, username } = evt.data
    const eventType = evt.type

    if (eventType === 'user.created') {
        console.log('user clerk id to save:' + evt.data.email_addresses[0].email_address);
        res.status(200).json({
            success: true,
            message: 'User created in DB',
        })

    }

    if (eventType === 'user.deleted') {
        console.log('user clerk id to delete:' + id)
        res.status(200).json({
            success: true,
            message: 'User deleted in DB',
        })
    }
}