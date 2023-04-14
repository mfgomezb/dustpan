'use client';

import { useState, useEffect } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { utils } from 'ethers';
import { assert } from 'console';

export default function Pile() {
  const [wallets, setWallets] = useState<string[]>([]);
  const [wallet, setWallet] = useState<string>('');
  const [walletError, setWalletError] = useState<string>('');

  const validateWallet = (wallet: string) => {
    if (utils.isAddress(wallet)) {
      setWalletError('');
      return true;
    }
    return setWalletError('Invalid wallet address');
  };

  const addWallet = () => {
    if (!validateWallet(wallet)) {
      return;
    }
    setWalletError('');
    setWallets([...wallets, wallet]);
    setWallet('');
  };

  useEffect(() => {
    const getBalances = async (address: string) =>
      await fetch(`/api/balances?address=${address}`);
    getBalances(wallets[wallets.length - 1]);

    return () => {};
  }, [wallets]);

  return (
    <>
      <div className="w-full max-w-md  ml-2 px-4 py-3 text-slate-500">
        {/* <h3 className="font-base">Add wallets that you wish to dust</h3> */}
      </div>
      <div className="mt-4 flex flex-row space-x-2 ">
        <div className="flex flex-col items-left space-y-2 px-4 py-3 w-[550px]">
          <div className="flex flex-row w-full max-w items-center space-x-2 shadow-md  bg-white p-5 rounded-xl border-slate-50">
            <Input
              type="0x"
              placeholder="0x"
              value={wallet}
              className="rounded-xl"
              onChange={(e) => setWallet(e.target.value)}
            />
            <Button
              type="submit"
              className="whitespace-nowrap text-base font-semibold rounded-xl"
              onClick={() => addWallet()}
            >
              add wallet
            </Button>
          </div>
          {walletError && (
            <div className="flex flex-row w-full max-w items-center space-x-2  shadow-md  bg-white p-5 rounded-xl border-slate-200">
              <small>{walletError}</small>
            </div>
          )}
          {wallets.length > 0 && (
            <div className="max-w space-y-2 shadow-md  bg-white p-5 rounded-xl border-slate-200">
              {wallets.map((wallet, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-slate-100 px-4 py-3 font-mono text-sm dark:border-slate-700 bg-slate-50"
                >
                  {wallet}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="flex flex-col items-left  space-y-2 px-4 py-3 w-[550px]">
          {wallets.length > 0 && (
            <div className="flex flex-col w-full space-y-2 max-w items-center space-x-2 shadow-md  bg-white p-5 rounded-xl border-slate-50">
              {wallets.map((wallet, i) => (
                <div
                  key={i}
                  className="w-full rounded-xl border border-slate-100 px-4 py-3 font-mono text-sm dark:border-slate-700 bg-slate-50"
                >
                  Loading balances{' '}
                  {wallet.slice(wallet.length - 8, wallet.length)}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
