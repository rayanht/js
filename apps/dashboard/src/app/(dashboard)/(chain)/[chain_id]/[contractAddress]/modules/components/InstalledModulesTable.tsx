"use client";

import { ScrollShadow } from "@/components/ui/ScrollShadow/ScrollShadow";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { CircleSlash } from "lucide-react";
import type { ContractOptions } from "thirdweb";
import type { Account } from "thirdweb/wallets";
import { ModuleCard } from "./module-card";

export const InstalledModulesTable = (props: {
  contract: ContractOptions;
  installedModules: {
    data?: string[];
    isPending: boolean;
  };
  refetchModules: () => void;
  ownerAccount: Account | undefined;
}) => {
  const { installedModules, ownerAccount } = props;

  const sectionTitle = (
    <h2 className="mb-3 font-bold text-2xl tracking-tight">
      Installed Modules
    </h2>
  );

  if (!installedModules.isPending && installedModules.data?.length === 0) {
    return (
      <>
        {sectionTitle}
        <Alert variant="destructive">
          <div className="flex items-center gap-3">
            <CircleSlash className="size-6 text-red-400" />
            <AlertTitle className="mb-0">No modules installed</AlertTitle>
          </div>
        </Alert>
      </>
    );
  }

  return (
    <>
      {sectionTitle}
      <ScrollShadow scrollableClassName="rounded-lg">
        <div className="flex flex-col gap-6">
          {installedModules.data?.map((moduleAddress) => (
            <ModuleCard
              key={moduleAddress}
              moduleAddress={moduleAddress}
              contract={props.contract}
              onRemoveModule={props.refetchModules}
              ownerAccount={ownerAccount}
            />
          ))}
        </div>
      </ScrollShadow>
    </>
  );
};
