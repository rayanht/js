import { notFound, redirect } from "next/navigation";
import { localhost } from "thirdweb/chains";
import { getContractPageParamsInfo } from "../_utils/getContractFromParams";
import { getContractPageMetadata } from "../_utils/getContractPageMetadata";
import { ContractNFTPage } from "./ContractNFTPage";
import { ContractNFTPageClient } from "./ContractNFTPage.client";

export default async function Page(props: {
  params: {
    contractAddress: string;
    chain_id: string;
  };
}) {
  const info = await getContractPageParamsInfo(props.params);

  if (!info) {
    notFound();
  }

  const { contract } = info;
  if (contract.chain.id === localhost.id) {
    return <ContractNFTPageClient contract={contract} />;
  }

  const { supportedERCs, functionSelectors } =
    await getContractPageMetadata(contract);

  if (!supportedERCs.isERC721 && !supportedERCs.isERC1155) {
    redirect(`/${props.params.chain_id}/${props.params.contractAddress}`);
  }

  return (
    <ContractNFTPage
      contract={contract}
      isErc721={supportedERCs.isERC721}
      functionSelectors={functionSelectors}
    />
  );
}
