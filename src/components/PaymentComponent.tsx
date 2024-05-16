import React, { useEffect, useRef, useState } from "react";
import Script from "next/script";
import { useSession } from "next-auth/react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "./ui/button";

interface PaymentInterface {
  creditCount: any;
  setCreditCount: any;
  showBuyCredit: any;
  setShowBuyCredit: any;
  isScriptLoaded: any;
  setIsScriptLoaded: any;
}
const PaymentComponent = ({
  creditCount,
  setCreditCount,
  showBuyCredit,
  setShowBuyCredit,
  isScriptLoaded,
  setIsScriptLoaded,
}: PaymentInterface) => {
  const { data: session } = useSession();
  const paypalRef = useRef<HTMLDivElement>(null);

  const [paymentSuccessful, setPaymentSuccessful] = useState(false);
  const addCredit = async function () {
    if (session?.user) {
      const res = await fetch("/api/addCredit", {
        method: "POST",
        body: JSON.stringify({ userId: session?.user?.id }),
      });
    }
  };
  useEffect(() => {
    if (isScriptLoaded && window.paypal && !paymentSuccessful) {
      window.paypal
        .Buttons({
          createOrder: (data: any, actions: any) => {
            return actions.order.create({
              intent: "CAPTURE",
              purchase_units: [
                {
                  description: "token",
                  amount: {
                    currency_code: "USD",
                    value: 1.0,
                  },
                },
              ],
            });
          },
          onApprove: async (data: any, actions: any) => {
            const order = await actions.order.capture();
            console.log("successful order:", order);
            await addCredit();
            setPaymentSuccessful(true);
          },
          onError: (err: any) => {
            console.error("PayPal Button Error:", err);
          },
        })
        .render(paypalRef.current);
    }
  }, [isScriptLoaded]);

  return (
    <div>
      <Script
        src="https://www.paypal.com/sdk/js?client-id=ATk9UOlq4DNa7YJ8wfl4s4lBeiNYCIgNYa8-xntjbHDRakQG89bTE4O_87i61fMB3pBY3A-qKUWZYowA&enable-funding=venmo&currency=USD"
        onLoad={() => {
          console.log("PayPal script loaded");
          setIsScriptLoaded(true);
        }}
      />
      {!paymentSuccessful && (
        <div>
          <p className="text-xl text-center my-5">1 TOKEN = $1</p>
          <div ref={paypalRef}></div>
        </div>
      )}
      <AlertDialog open={paymentSuccessful}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Payment successful</AlertDialogTitle>
            <AlertDialogDescription>
              1 TOKEN added to your account
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button
              className="bg-red-500"
              onClick={() => {
                setPaymentSuccessful(false);
                setCreditCount(creditCount + 1);
                setShowBuyCredit(false);
                setIsScriptLoaded(false);
              }}
            >
              Continue
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PaymentComponent;
