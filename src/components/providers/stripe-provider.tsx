"use client";

import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { ReactNode } from "react";

const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
);

/**
 * Wrapper for Stripe Elements.
 * Use this around any component that needs CardElement or PaymentElement.
 */
export function StripeProvider({ children }: { children: ReactNode }) {
    return (
        <Elements
            stripe={stripePromise}
            options={{
                appearance: {
                    theme: "flat",
                    variables: {
                        colorPrimary: "#1a1a1a",
                        colorBackground: "#ffffff",
                        colorText: "#1a1a1a",
                        colorDanger: "#c0392b",
                        fontFamily:
                            '"DM Serif Display", Georgia, serif',
                        spacingUnit: "4px",
                        borderRadius: "0px",
                    },
                    rules: {
                        ".Input": {
                            borderColor: "rgba(26, 26, 26, 0.2)",
                            boxShadow: "none",
                        },
                        ".Input:focus": {
                            borderColor: "#c0392b",
                            boxShadow: "none",
                        },
                        ".Label": {
                            textTransform: "uppercase",
                            letterSpacing: "0.1em",
                            fontSize: "10px",
                            fontWeight: "700",
                        },
                    },
                },
            }}
        >
            {children}
        </Elements>
    );
}
