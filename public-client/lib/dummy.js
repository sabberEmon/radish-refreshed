const nftImageLinks = [
  "https://buffwild.b-cdn.net/Radish/6751.png",
  "https://buffwild.b-cdn.net/Airdrop%201%20of%201s/British%20Buff.png",
  "https://singularityx.net/collection/ssn/small/1887.png",
];

export const getNfts = (numberOfNfts) => {
  // generate random nfts with random pictures from the array nftImageLinks
  const nfts = [];
  for (let i = 0; i < numberOfNfts; i++) {
    // generate nfts wwith random values
    const nft = {
      // random id like 640bae171c9ae01613a8247a
      _id:
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15),
      referenceId: i,
      collectionIdentifier: "buff",
      parentCollection: {},
      title: "Lorem Ipsum Dus Mer Dolor #726",
      // lorem ipsum
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Non adipisci obcaecati, corporis soluta praesentium recusandae. Doloribus magni perspiciatis ea, laboriosam provident tempore dolor, non distinctio repellendus sed at ad autem?",
      picture: nftImageLinks[Math.floor(Math.random() * nftImageLinks.length)],
      price: 100,
      // random rarity score
      totalRarityScore:
        Math.floor(Math.random() * 1000) +
        Math.floor(Math.random() * 100) / 100,
      rank: Math.floor(Math.random() * 1000),
      attributes: [],
    };

    // push nft to nfts array
    nfts.push(nft);
  }

  return nfts;
};

export const getCollections = (numberOfCollections) => {
  const collections = [];
  for (let i = 0; i < numberOfCollections; i++) {
    // generate collections with random values
    const collection = {
      // random id like 640bae171c9ae01613a8247a
      _id:
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15),
      collectionIdentifier: "radish",
      title: "Harvest Season",
      creator: {},
      description:
        "10,000 Radish mascots, designed by the founder. An in-house NFT collection to represent the ecosystem. ",
      collectionProfilePicture:
        "https://farm.radishsquare.com/storage/1678469330841_StarSailorsNation.jpg",
      collectionBanner:
        "https://farm.radishsquare.com/storage/1678390405110_Banner.jpg",
      type: "art",
      nftCount: 3301,
      ownerCount: 361,
      floorPrice: 200,
      volume: 620000,
      royalty: 0.09,
      maxWalletLimit: null,
      nickname: "Radish",
      buyType: "Random",
    };

    // push collection to collections array
    collections.push(collection);
  }

  return collections;
};
