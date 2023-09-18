'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';

import Button from '@/components/ui/button';
import Currency from '@/components/ui/currency';
import useCart from '@/hooks/use-cart';
import { toast } from "react-hot-toast";

const Summary = () => {
  const [token, setToken] = useState('');
  const items = useCart((state) => state.items);
  const removeAll = useCart((state) => state.removeAll);


  const totalPrice = items.reduce((total, item) => {
    return total + Number(item.price);
  }, 0);

  const data = {
    totalPrice,
    productIds: items.map((item) => item.id)
  }

  const onCheckout = async () => {

    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/checkout`, {
      productIds: items.map((item) => item.id)
    });
    
    setToken(response.data.token);
  }

  useEffect(() => {
    if (token) {
      // @ts-ignore
      window.snap.pay(token, {
        onSuccess: function(){
          toast.success('Payment completed.');
          removeAll();                    
        },
        onPending: function(){
          /* You may add your own implementation here */
          alert("wating your payment!");
        },
        onError: function(){
          /* You may add your own implementation here */
          alert("payment failed!");
          setToken('');
        },
        onClose: function(){
          /* You may add your own implementation here */
          alert('you closed the popup without finishing the payment');
          setToken('');
        }
      })
    }
  }, [token]);

  useEffect(() => {
    // You can also change below url value to any script url you wish to load, 
    // for example this is snap.js for Sandbox Env (Note: remove `.sandbox` from url if you want to use production version)
    const midtransScriptUrl = 'https://app.sandbox.midtrans.com/snap/snap.js';  
  
    let scriptTag = document.createElement('script');
    scriptTag.src = midtransScriptUrl;
  
    // Optional: set script attribute, for example snap.js have data-client-key attribute 
    // (change the value according to your client-key)
    const myMidtransClientKey = 'SB-Mid-client-VWQL_zsXSvXlXI8E';
    scriptTag.setAttribute('data-client-key', myMidtransClientKey);
  
    document.body.appendChild(scriptTag);
  
    return () => {
      document.body.removeChild(scriptTag);
    }
  }, []);

  return (
    <div className='mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8'>
      <h2 className='text-lg font-medium text-gray-900'>Order Summary</h2>
      <div className='mt-6 space-y-4'>
        <div className='flex items-center justify-between border-t border-gray-200 pt-4'>
          <div className='text-base font-medium text-gray-900'>Order total</div>
          <Currency value={totalPrice} />
        </div>
      </div>
      <Button onClick={onCheckout} className='w-full mt-6'>
        Checkout
      </Button>
    </div>
  );
};

export default Summary;
