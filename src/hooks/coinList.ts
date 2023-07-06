import { useQuery } from '@tanstack/react-query';
import type { Chain, CoinProfile } from '../type';

export const useSuiCoinList = () => {
  const query = useQuery({
    queryKey: ['sui', 'coinList'],
    // TODO: Implement this
    queryFn: async () => suiCoinList,
    refetchInterval: 60_000, // 1 min
    refetchOnWindowFocus: false,
  });

  return query;
};

export const useCoinList = ({
  chain = 'sui',
}: {
  chain: Chain;
}) => {
  if (chain === 'sui') {
    return useSuiCoinList();
  }

  throw new Error(`Unsupported chain: ${chain}`);
};

export const initialCoinSelection: Record<Chain, { source: CoinProfile, target: CoinProfile }> = {
  sui: {
    source: {
      'coinType': '0x2::sui::SUI',
      'decimals': 9,
      'name': 'Sui',
      'symbol': 'SUI',
      'description': '',
      'iconUrl': null,
      'id': '0x9258181f5ceac8dbffb7030890243caed69a9599d2886d957a9cb7656af3bdb3'
    },
    target: {
      'coinType': '0x5d4b302506645c37ff133b98c4b50a5ae14841659738d6d733d59d0d217a93bf::coin::COIN',
      'decimals': 6,
      'name': 'USD Coin',
      'symbol': 'USDC',
      'description': '',
      'iconUrl': null,
      'id': '0x4fbf84f3029bd0c0b77164b587963be957f853eccf834a67bb9ecba6ec80f189'
    },
  },
  aptos: {
    source: null as never,
    target: null as never,
  },
};

// TODO: Remove this
const suiCoinList: CoinProfile[] = [
  {
    'coinType': '0x2::sui::SUI',
    'decimals': 9,
    'name': 'Sui',
    'symbol': 'SUI',
    'description': '',
    'iconUrl': null,
    'id': '0x9258181f5ceac8dbffb7030890243caed69a9599d2886d957a9cb7656af3bdb3'
  },
  {
    'coinType': '0x5d4b302506645c37ff133b98c4b50a5ae14841659738d6d733d59d0d217a93bf::coin::COIN',
    'decimals': 6,
    'name': 'USD Coin',
    'symbol': 'USDC',
    'description': '',
    'iconUrl': null,
    'id': '0x4fbf84f3029bd0c0b77164b587963be957f853eccf834a67bb9ecba6ec80f189'
  },
  {
    'coinType': '0x7ee1b9a26097254c724c25b344d6285edaf567e2936c91438a1cf7c155a86961::alpha_sui::ALPHA_SUI',
    'decimals': 9,
    'name': 'AlphaSui',
    'symbol': 'ALPHA',
    'description': '',
    'iconUrl': 'https://ipfs.bluemove.io/token/alpha-coin.png',
    'id': '0x8b342ea171c9e7aa8952cad58577fd6c6c1e212b43cbc1b2e15d5981631b0374'
  },
  {
    'coinType': '0xd9f9b0b4f35276eecd1eea6985bfabe2a2bbd5575f9adb9162ccbdb4ddebde7f::smove::SMOVE',
    'decimals': 9,
    'name': 'MOVE',
    'symbol': 'MOVE',
    'description': 'BlueMove',
    'iconUrl': 'https://bluemove.net/BlueMove_main_logo_RGB-Blue_512.png',
    'id': '0x7cfcc03055a0ba4c5ba7fb9727a77e23ccf4d59035646c3c3caf58060eed09a1'
  },
  {
    'coinType': '0xc060006111016b8a020ad5b33834984a437aaa7d3c74c18e09a95d48aceab08c::coin::COIN',
    'decimals': 6,
    'name': 'Tether USD',
    'symbol': 'USDT',
    'description': '',
    'iconUrl': null,
    'id': '0xfb0e3eb97dd158a5ae979dddfa24348063843c5b20eb8381dd5fa7c93699e45c'
  },
  {
    'coinType': '0xc2edf324c59ad2481b47e327a710cb5353074af254560b3182d91b3a7feab6c0::PEPEGOAT::PEPEGOAT',
    'decimals': 6,
    'name': 'pepeGOAT',
    'symbol': 'PepeGOAT',
    'description': 'PepeGOAT',
    'iconUrl': 'https://ipfs.io/ipfs/QmXGaEc2XPKZetBesrZrDUfYF6UgQ7VRk8wuCVCobDt6wg',
    'id': '0x05a1778afe57d182a45948460e4c033bce5bb4009277e537dfd1384ea596251a'
  },
  {
    'coinType': '0xebbf537bc3686be32fe22b498b42715641bbb209267be72236a352e0444cc5df::sui_pepe::SUI_PEPE',
    'decimals': 6,
    'name': 'SUI PEPE',
    'symbol': 'SPEPE',
    'description': 'The biggest memecoin on SUI blockchain.',
    'iconUrl': 'https://sui-pepe.xyz/_next/static/media/logo.6e0d8f53.png',
    'id': '0xfdf83fbcc1ad8a407d32791e43a4019e89474f7031aa64b8c05834b1af420eae'
  },
  {
    'coinType': '0x71849f2d5e301aa9cb9398ba18ed1c190a6407eb2fda413c54d21c9fbafd72e8::stz::STZ',
    'decimals': 5,
    'name': 'Suitizen',
    'symbol': 'STZ',
    'description': '',
    'iconUrl': 'https://i.imgur.com/rJnMzhr.png',
    'id': '0xb3a51e0af9ebb6e5f56f11cfb981b8b388bd8a16106fe33f2750499de1e19cb0'
  },
  {
    'coinType': '0x1e520f3bb4b93938cf2bc90fb8d709ed3042dbf3c0290824c0ace15e583e8162::suishiba::SUISHIBA',
    'decimals': 6,
    'name': 'SuiShiba',
    'symbol': 'SuiShib',
    'description': '#SuiShiba is a community-driven meme project. Built by a team of believers, Suishiba is ready to take on any challenge and have some fun along the way!',
    'iconUrl': 'https://pbs.twimg.com/profile_images/1652612936764997633/fHY1LNIz_400x400.jpg',
    'id': '0x6294372ce3c4a64280e0f286519db33a54ed55c0d4122529cd346d871d8d2368'
  },
  {
    'coinType': '0x239e9725bdab1fcb2e4798a057da809e52f13134a09bc9913659d4a80ddfdaad::shui::SHUI',
    'decimals': 6,
    'name': 'Shui Quan',
    'symbol': 'SHUI',
    'description': 'The first Chinese Water dog on SUI Chain',
    'iconUrl': 'https://i.imgur.com/xH1sEC5.png',
    'id': '0x530dab9766efd0788e823c53d9784fa0d83c1850325922e8ecf839e73347aac3'
  },
  {
    'coinType': '0xafde00ead81e23ace89f1410e1495f23f6000a488aac6afd42352331888d248f::sfloki::SFLOKI',
    'decimals': 9,
    'name': 'SuiFloki-Inu',
    'symbol': 'SFLOKI',
    'description': 'The first meme token on Sui Blockchain',
    'iconUrl': 'https://imagetolink.com/ib/xND7a2PK0X.jpg',
    'id': '0x91ffe1737dc2d6eb8af4ce2b227725f12926a636074408df344079802f94592c'
  },
  {
    'coinType': '0xe2872bf9ede9074a333308a7b91026912aa68b83672b7d3b3f5f8dd96c44a0a2::suidoge::SUIDOGE',
    'decimals': 4,
    'name': 'SuiDoge',
    'symbol': 'SuiDoge',
    'description': 'SuiDoge is a meme coin set up for rapid expansion of DOGE and SUI ecosystem. It has unique fun and perfect token model.',
    'iconUrl': 'https://suidoge.dog/sui/suidoge.png',
    'id': '0x5e9c22b1ea650c950da315bd7252613d934de7e9146d9036234800ef8cfbd454'
  },
  {
    'coinType': '0xc8918d9f8e5a0818f946ee47162c1dba5f74a3e3e7fda98c87c88c78eaaae833::ornn_token::ORNN_TOKEN',
    'decimals': 9,
    'name': 'ornn',
    'symbol': 'ORNN',
    'description': '',
    'iconUrl': 'https://bafybeigxdcbuu2vmd2mwh6j5bmme2sjcby47uyeolsu724feoptmpb73ai.ipfs.w3s.link/ornn_logo.png',
    'id': '0xf7aa1e1fe866d3d4c69ee9f9a8488c0bef018204e5209f17b49feb0f8d899fa3'
  },
  {
    'coinType': '0x0737ead67630854fc0775f6ff901e8a2ac9f8a6304adbce228b5db478b5f3fa6::suishib::SUISHIB',
    'decimals': 2,
    'name': 'SuiShib',
    'symbol': 'SuiShib',
    'description': '',
    'iconUrl': 'https://photos.pinksale.finance/file/pinksale-logo-upload/1683222398484-e5071bfa43f0848c21571df60229ca89.png',
    'id': '0xee47c0517d3a17cc30719a130a814aeda5baf4fac4b938d217fef7ffa7443e55'
  },
  {
    'coinType': '0x06864a6f921804860930db6ddbe2e16acdf8504495ea7481637a1c8b9a8fe54b::cetus::CETUS',
    'decimals': 9,
    'name': 'Cetus Token',
    'symbol': 'CETUS',
    'description': 'CETUS is the native token of Cetus Protocol.',
    'iconUrl': 'https://uxcdefo3r2uemooidt2kk2stykakvwd2m6nasg5lhbfaxemm4i3a.arweave.net/pcQyFduOqEY5yBz0pWpTwoCq2HpnmgkbqzhKC5GM4jY',
    'id': '0x4c0dce55eff2db5419bbd2d239d1aa22b4a400c01bbb648b058a9883989025da'
  },
  {
    'coinType': '0xaf8cd5edc19c4512f4259f0bee101a40d41ebed738ade5874359610ef8eeced5::coin::COIN',
    'decimals': 8,
    'name': 'Wrapped Ether',
    'symbol': 'WETH',
    'description': '',
    'iconUrl': null,
    'id': '0x8900e4ceede3363bef086d6b50ca89d816d0e90bf6bc46efefe1f8455e08f50f'
  },
  {
    'coinType': '0x1d58e26e85fbf9ee8596872686da75544342487f95b1773be3c9a49ab1061b19::suia_token::SUIA_TOKEN',
    'decimals': 9,
    'name': 'SUIA',
    'symbol': 'SUIA',
    'description': 'SUIA is the native token of Suia.io',
    'iconUrl': 'https://bafkreia2vfy4zap6plymncr37eeywxbno6zzfcchnrvrlys3rgbimx5w5a.ipfs.nftstorage.link/',
    'id': '0x5875baf15d9fd9cc6148dd3866266f6fc3a3064170434efe97b9ea8c23a50775'
  },
  {
    'coinType': '0xb231fcda8bbddb31f2ef02e6161444aec64a514e2c89279584ac9806ce9cf037::coin::COIN',
    'decimals': 6,
    'name': 'USD Coin',
    'symbol': 'USDC',
    'description': '',
    'iconUrl': null,
    'id': '0x39047ec989791d939efee4c9b9dbc6885c5d12a5aaacf44152319b2289ea9b9e'
  },
  {
    'coinType': '0xe32d3ebafa42e6011b87ef1087bbc6053b499bf6f095807b9013aff5a6ecd7bb::coin::COIN',
    'decimals': 6,
    'name': 'USD Coin (Arb1)',
    'symbol': 'USDC',
    'description': '',
    'iconUrl': null,
    'id': '0xe2720ee6eed0e11490bdbd1c6cc2282a7e442bf86c99a3a4ec67797c84b9fffc'
  },
  {
    'coinType': '0x909cba62ce96d54de25bec9502de5ca7b4f28901747bbf96b76c2e63ec5f1cba::coin::COIN',
    'decimals': 8,
    'name': 'USD Coin',
    'symbol': 'USDC',
    'description': '',
    'iconUrl': null,
    'id': '0x8a775c4bbc9639c88e86fdc624bb30d0bfd22a1597b03da29198de214ddaa126'
  },
  {
    'coinType': '0xbff8dc60d3f714f678cd4490ff08cabbea95d308c6de47a150c79cc875e0c7c6::sbox::SBOX',
    'decimals': 1,
    'name': 'SuiBoxer Coin',
    'symbol': 'SBOX',
    'description': 'SUI said fuck off but we say welcome, airdrop for everyone.',
    'iconUrl': 'https://pntvpw2m7uxvx7j4roojxy3sb2lrc57jqzwo66kafwdjaj5v3oea.arweave.net/e2dX20z9L1v9PIucm-NyDpcRd-mGbO95QC2GkCe124g',
    'id': '0x7f35ac7fe5a05df9e68fa7d633a382db4f002209e57ccee3bf9d9f73eedff1b9'
  },
  {
    'coinType': '0xe4239cd951f6c53d9c41e25270d80d31f925ad1655e5ba5b543843d4a66975ee::SUIP::SUIP',
    'decimals': 9,
    'name': 'SuiPad',
    'symbol': 'SUIP',
    'description': 'SuiPad The Premier Launchpad for Tier-1 Projects',
    'iconUrl': null,
    'id': '0x3e50a0a576877092bfaa4f8e4ec8cd7dd0a4a281bec3f806583949cf7873d07b'
  },
  {
    'coinType': '0x202591744d54ee4f4af736ef3b8508f3d46d982c36747d9587032bd549122179::luck::LUCK',
    'decimals': 9,
    'name': 'LUCKYSTAR',
    'symbol': 'LUCK',
    'description': 'LUCKYSTAR TOKEN',
    'iconUrl': 'https://luckystar-web.s3.ap-southeast-1.amazonaws.com/starlogo.svg',
    'id': '0xa9cb7f72c96d23437199bcf6731b08a7e225d7efe427d04f4c69e63a8940c2f3'
  },
  {
    'coinType': '0xd2013e206f7983f06132d5b61f7c577638ff63171221f4f600a98863febdfb47::toce::TOCE',
    'decimals': 9,
    'name': 'Tocen Token',
    'symbol': 'TOCE',
    'description': 'Tocen - an All-In-One Platform for DeFi, NFTFi & GameFi',
    'iconUrl': 'https://ipfs.tocen.co/tocen/toce.png',
    'id': '0xf8e8c6fe52bdee8ceb39e15994f8188901479c3434103bcd9faab9fcd8180d47'
  },
  {
    'coinType': '0x5580c843b6290acb2dbc7d5bf8ab995d4d4b6ba107e2a283b4d481aab1564d68::brt::BRT',
    'decimals': 6,
    'name': 'Bankrupt',
    'symbol': 'BRT',
    'description': 'The root problem with conventional currencies is all the trust that\'s required to make it work. The central bank must be trusted not to debase the currency, but the history of fiat currencies is full of breaches of that trust. And that\'s how cryptocurrency was born. - Satoshi Nakamoto',
    'iconUrl': 'https://bafybeibxug6ipdh4dsk5gnudzqofk7oszibs2yrasoatibgvg333smuzqq.ipfs.nftstorage.link',
    'id': '0xf1991ac1a0765af9055c93f3a8fff27671176a85b16259de4362f2c82a235622'
  },
  {
    'coinType': '0x9fe1780ac27ec50c9c441fb31822f5c148f841f09ee455c6a0daf7c634a30a27::aifrens::AIFRENS',
    'decimals': 0,
    'name': 'xAIFRENS',
    'symbol': 'xAIFRENS',
    'description': 'xAIFRENS is a deflationary token that will be utilized by SUI ecosystem applications. The total supply of xAIFRENS tokens is 210,000,000,000,000,000. xAIFRENS is owned by everyone in the SUI community and serves as a crucial key to unlock the future utilities of the AIFRENS universe.',
    'iconUrl': 'https://suifrens.ai/icon.png',
    'id': '0x72828d5a3b8c44e70fb37b7dc3544a2fb75712ed82ebaa5d03c649ba3c9b107a'
  },
  {
    'coinType': '0xcf72ec52c0f8ddead746252481fb44ff6e8485a39b803825bde6b00d77cdb0bb::coin::COIN',
    'decimals': 6,
    'name': 'USD Coin (PoS)',
    'symbol': 'USDC',
    'description': '',
    'iconUrl': null,
    'id': '0xdb9ed08481f9dd565fd36b834eb3c2cda1ee5f388048154807cffcb0267ed3b2'
  },
  {
    'coinType': '0xb848cce11ef3a8f62eccea6eb5b35a12c4c2b1ee1af7755d02d7bd6218e8226f::coin::COIN',
    'decimals': 8,
    'name': 'Wrapped BNB',
    'symbol': 'WBNB',
    'description': '',
    'iconUrl': null,
    'id': '0x1d0975ab0726f2e52384b6ea0f2c94c2dbdad8b004ee6b5ee552a3c789c044f0'
  },
  {
    'coinType': '0xdbe380b13a6d0f5cdedd58de8f04625263f113b3f9db32b3e1983f49e2841676::coin::COIN',
    'decimals': 8,
    'name': 'Wrapped Matic',
    'symbol': 'WMATIC',
    'description': '',
    'iconUrl': null,
    'id': '0xb45d92d3ee25147c3235f881e63f7f362f9d6cbdfcba1f120fae6a6c930a1c8c'
  },
  {
    'coinType': '0x027792d9fed7f9844eb4839566001bb6f6cb4804f66aa2da6fe1ee242d896881::coin::COIN',
    'decimals': 8,
    'name': 'Wrapped BTC',
    'symbol': 'WBTC',
    'description': '',
    'iconUrl': null,
    'id': '0x5d3c6e60eeff8a05b693b481539e7847dfe33013e7070cdcb387f5c0cac05dfd'
  },
  {
    'coinType': '0xb7844e289a8410e50fb3ca48d69eb9cf29e27d223ef90353fe1bd8e27ff8f3f8::coin::COIN',
    'decimals': 8,
    'name': 'Wrapped SOL',
    'symbol': 'SOL',
    'description': '',
    'iconUrl': null,
    'id': '0x4d2c39082b4477e3e79dc4562d939147ab90c42fc5f3e4acf03b94383cd69b6e'
  },
  {
    'coinType': '0x247a6d271810efbe80943433e84b9360e2f976fce89e7c19dc680f5aae8738e2::flame::FLAME',
    'decimals': 6,
    'name': 'Flame Token',
    'symbol': 'FLAME',
    'description': 'Flame Token',
    'iconUrl': 'https://flameswap.io/assets/coins/FLAME.png',
    'id': '0x1f42388fe61ae47fcd33f089bd0ee73f19f3984b2b6c09a51a755d0420fe6eab'
  },
  {
    'coinType': '0xc8709fd01438ba1a8cd63b20e53ec23d49a883fa6f79eb19247541543492b490::suipig::SUIPIG',
    'decimals': 2,
    'name': 'SuiPig',
    'symbol': 'SuiPig',
    'description': '',
    'iconUrl': null,
    'id': '0x8875dd7db68085017fe50f98a3b1711d0c81f533be9c526b48473fbde49be297'
  },
  {
    'coinType': '0x34ba93ec7873199b6b52a52890351b6ebbed25bb89deaba356669aadbd203865::suiyyds::SUIYYDS',
    'decimals': 2,
    'name': 'YYDS',
    'symbol': 'SuiYYDS',
    'description': '',
    'iconUrl': 'https://photos.pinksale.finance/file/pinksale-logo-upload/1683451356727-9d6040640631c381c0bf5391f465c7e2.jpg',
    'id': '0x42d2a0da126b944fe292938abc4d873bf670f59b248d0451e8e329c527f78790'
  },
  {
    'coinType': '0x0c5c14a7cde5d50ced153e1169f7132a68c0bee431911ac09d22073b13e0c624::pepesui::PEPESUI',
    'decimals': 2,
    'name': 'PEPE SUI',
    'symbol': 'PEPES',
    'description': '',
    'iconUrl': 'https://i.imgur.com/ssI98A0.png',
    'id': '0xc822c06bea0c0cb338ddebd4b9dec5d3eca45b0352c69d9b2cd243e912d7a628'
  },
  {
    'coinType': '0x5cc7b6ed0ce0d43d08667793f6efe7a34d678a780755dc37ea8bfa8805f63327::coin::COIN',
    'decimals': 8,
    'name': 'BTCB Token',
    'symbol': 'BTCB',
    'description': '',
    'iconUrl': null,
    'id': '0x144064a22dc2594b6c972be990ae93dae341a0e660fe150604970b31fab4fb76'
  },
  {
    'coinType': '0x5029d5a94429a73b8036cd67192d9c5e09bbc2c0fee942d50075a9edba66744f::coin::COIN',
    'decimals': 8,
    'name': 'Ethereum Token',
    'symbol': 'ETH',
    'description': '',
    'iconUrl': null,
    'id': '0xbfcaf4b726ca7ae523289e03a2a82e892145b1a285cb3588c2e1de724d1bf6eb'
  },
  {
    'coinType': '0x603b488c87e0d1df64560a61418c87238d440a29ee39bbd757b0c92d38a35c7c::coin::COIN',
    'decimals': 8,
    'name': 'Tether USD',
    'symbol': 'USDT',
    'description': '',
    'iconUrl': null,
    'id': '0xc72d1279a774a6720fa4b4793f3c925119ed99ee8bb14d7c8ff685997cfb41b3'
  },
  {
    'coinType': '0x361dd589b98e8fcda9a7ee53b85efabef3569d00416640d2faa516e3801d7ffc::TOKEN::TOKEN',
    'decimals': 9,
    'name': 'Suiswap Token',
    'symbol': 'SSWP',
    'description': 'Suiswap Platform Governance Token',
    'iconUrl': 'https://suiswap.app/images/token/suiswap.svg',
    'id': '0x41911b7d8d87ceee4043ea3b83f402a03d0ffa0b286e78b23dcd81c9cde0f02f'
  },
  {
    'coinType': '0xf0fe2210b4f0c4e3aff7ed147f14980cf14f1114c6ad8fd531ab748ccf33373b::bswt::BSWT',
    'decimals': 9,
    'name': 'BaySwap Token',
    'symbol': 'BSWT',
    'description': 'BaySwap governance token',
    'iconUrl': 'https://app.bayswap.io/bswt.png',
    'id': '0xeef5a485257ebd7e555c6d33a0a6a6cac157e10c05fe6a819488b8e521bce5f2'
  }
];
