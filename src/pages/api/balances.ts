import type { NextApiRequest, NextApiResponse } from 'next';
import Web3 from 'web3';
import { AbiItem } from 'web3-utils';

interface Token {
  symbol: string;
  address: string;
}

async function fetchTokens(): Promise<Token[]> {
  try {
    const url =
      'https://api.coingecko.com/api/v3/coins/list?include_platform=true';
    const response = await fetch(url);
    console.log(response);
    const tokens = await response.json();
    const erc20Tokens = tokens.filter(
      (token: any) => token.platform && token.platform.id === 'ethereum'
    );

    return erc20Tokens;
  } catch (e) {
    console.error('Error fetching tokens:', e);
    throw new Error('Failed to fetch tokens from CoinGecko');
  }
}

const providerUrl =
  'https://goerli.infura.io/v3/61694e97a5a64d979d76ebefcf5c250f';
const web3 = new Web3(new Web3.providers.HttpProvider(providerUrl));

const erc20Abi: AbiItem[] = [
  {
    constant: true,
    inputs: [{ name: '_owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: 'balance', type: 'uint256' }],
    type: 'function',
  },
];

async function getTokenBalances(
  address: string,
  tokens: Token[]
): Promise<{ [symbol: string]: string }> {
  const balances: { [symbol: string]: string } = {};

  for (const token of tokens) {
    const tokenContract = new web3.eth.Contract(erc20Abi, token.address);
    const balance = await tokenContract.methods.balanceOf(address).call();
    balances[token.symbol] = web3.utils.fromWei(balance, 'ether');
  }

  return balances;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { address } = req.query;

  if (!address || typeof address !== 'string') {
    return res
      .status(400)
      .json({ error: 'Address query parameter is required' });
  }

  try {
    const tokens = await fetchTokens();

    const balances = await getTokenBalances(address, tokens);
    res.status(200).json(balances);
  } catch (error) {
    res
      .status(500)
      .json({ error: 'An error occurred while fetching token balances' });
  }
}
