import { notFound, redirect } from "next/navigation";
import { localhost } from "thirdweb/chains";
import { getContractPageParamsInfo } from "../_utils/getContractFromParams";
import { getContractPageMetadata } from "../_utils/getContractPageMetadata";
import { ContractSplitPage } from "./ContractSplitPage";
import { ContractSplitPageClient } from "./ContractSplitPage.client";

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
    return <ContractSplitPageClient contract={contract} />;
  }

  const { isSplitSupported } = await getContractPageMetadata(contract);

  if (!isSplitSupported) {
    redirect(`/${props.params.chain_id}/${props.params.contractAddress}`);
  }

  return <ContractSplitPage contract={contract} />;
}
