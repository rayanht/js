import { notFound } from "next/navigation";
import { localhost } from "thirdweb/chains";
import { getContractPageParamsInfo } from "../_utils/getContractFromParams";
import { getContractPageMetadata } from "../_utils/getContractPageMetadata";
import { ContractSettingsPage } from "./ContractSettingsPage";
import { ContractSettingsPageClient } from "./ContractSettingsPage.client";

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
    return <ContractSettingsPageClient contract={contract} />;
  }

  const { functionSelectors } = await getContractPageMetadata(info.contract);

  return (
    <ContractSettingsPage
      contract={info.contract}
      functionSelectors={functionSelectors}
    />
  );
}
