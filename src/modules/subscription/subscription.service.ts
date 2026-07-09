import config from "../../config";
import { prisma } from "../../lib/prisma";
import { stripe } from "../../lib/stripe";

const createSubscriptionSession = async (userId: string) => {
    const transectionResult = await prisma.$transaction(async (tx) => {
        const user = await tx.user.findUniqueOrThrow({
            where: {
                id: userId,
            },
            include: {
                subscription: true,
            },
        });

        // for old subscriber
        let stripeCustomerId = user.subscription?.stripeCustomerId;

        if (!stripeCustomerId) {
            // for new subscriber
            const customer = await stripe.customers.create({
                email: user.email,
                name: user.name,
                metadata: { userId: user.id },
            });
            stripeCustomerId = customer.id;
        }

        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    price: config.stripe_price_id,
                    quantity: 1,
                },
            ],
            mode: "subscription",
            customer: stripeCustomerId,
            payment_method_types: ["card"],
            success_url: `${config.app_url}/premium?success=true`,
            cancel_url: `${config.app_url}/payment?success=false`,
            metadata: { userId: user.id },
        });

        return session.url;
    });

    return {
        paymentUrl: transectionResult,
    };
};

const handleWebook = async (payload: Buffer, signature: string) => {
    const endpointSecret = config.stripe_webhook_secret;
    const event = stripe.webhooks.constructEvent(
        payload,
        signature,
        endpointSecret,
    );
    // Handle the event
    switch (event.type) {
        case "checkout.session.completed":
            // const paymentObject = event.data.object;

            break;
        case "customer.subscription.updated":
            // const paymentObjects = event.data.object;

            break;
        case "customer.subscription.deleted":
            // const paymentObjectss = event.data.object;

            break;
        default:
            // Unexpected event type
            console.log(
                `No event matched. Unhandled event type ${event.type}.`,
            );
            break;
    }
};

export const subscriptionServices = {
    createSubscriptionSession,
    handleWebook,
};
