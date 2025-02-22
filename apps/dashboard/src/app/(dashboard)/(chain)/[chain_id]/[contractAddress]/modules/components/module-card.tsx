import { WalletAddress } from "@/components/blocks/wallet-address";
import { CopyAddressButton } from "@/components/ui/CopyAddressButton";
import { Spinner } from "@/components/ui/Spinner/Spinner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useMutation } from "@tanstack/react-query";
import { TransactionButton } from "components/buttons/TransactionButton";
import { InfoIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  type ContractOptions,
  getContract,
  sendTransaction,
  waitForReceipt,
} from "thirdweb";
import { uninstallModuleByProxy } from "thirdweb/modules";
import type { Account } from "thirdweb/wallets";
import { useModuleContractInfo } from "./moduleContractInfo";

type ModuleProps = {
  moduleAddress: string;
  contract: ContractOptions;
  onRemoveModule: () => void;
  ownerAccount: Account | undefined;
};

export function ModuleCard(props: ModuleProps) {
  const { contract, moduleAddress, ownerAccount } = props;
  const [isUninstallModalOpen, setIsUninstallModalOpen] = useState(false);

  const contractInfo = useModuleContractInfo(
    getContract({
      address: moduleAddress,
      chain: contract.chain,
      client: contract.client,
    }),
  );

  const uninstallMutation = useMutation({
    mutationFn: async (account: Account) => {
      const uninstallTransaction = uninstallModuleByProxy({
        contract,
        chain: contract.chain,
        client: contract.client,
        moduleProxyAddress: moduleAddress,
        moduleData: "0x",
      });

      const txResult = await sendTransaction({
        transaction: uninstallTransaction,
        account,
      });

      await waitForReceipt(txResult);
    },
    onSuccess() {
      toast.success("Module uninstalled successfully");
      props.onRemoveModule();
    },
    onError(error) {
      toast.error("Failed to uninstall module");
      console.error(error);
    },
  });

  const handleRemove = async () => {
    if (!ownerAccount) {
      toast.error("Wallet is not connected");
      return;
    }

    uninstallMutation.mutate(ownerAccount);
  };

  if (!contractInfo) {
    return <Skeleton className="h-[190px] w-full border border-border" />;
  }

  return (
    <>
      <ModuleCardUI
        contractInfo={{
          name: contractInfo.name,
          description: contractInfo.description,
          publisher: contractInfo.publisher,
          version: contractInfo.version,
        }}
        isOwnerAccount={!!ownerAccount}
        uninstallButton={{
          onClick: () => {
            setIsUninstallModalOpen(true);
          },
          isPending: uninstallMutation.isPending,
        }}
        moduleAddress={moduleAddress}
      />

      <Dialog
        open={isUninstallModalOpen}
        onOpenChange={setIsUninstallModalOpen}
      >
        <DialogContent className="z-[10001]" dialogOverlayClassName="z-[10000]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleRemove();
            }}
          >
            <DialogHeader>
              <DialogTitle>Uninstall Module</DialogTitle>
              <DialogDescription>
                Are you sure you want to uninstall{" "}
                <span className="font-medium text-foreground ">
                  {contractInfo.name}
                </span>{" "}
                ?
              </DialogDescription>
            </DialogHeader>

            <DialogFooter className="mt-10 flex-row justify-end gap-3 md:gap-1">
              <Button
                type="button"
                onClick={() => setIsUninstallModalOpen(false)}
                variant="outline"
              >
                Cancel
              </Button>

              <TransactionButton
                txChainID={contract.chain.id}
                transactionCount={1}
                isLoading={uninstallMutation.isPending}
                type="submit"
                colorScheme="red"
                className="flex"
              >
                Uninstall
              </TransactionButton>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

export type ModuleCardUIProps = {
  children?: React.ReactNode;
  contractInfo: {
    name: string;
    description?: string;
    version?: string;
    publisher?: string;
  };
  moduleAddress: string;
  isOwnerAccount: boolean;
  uninstallButton: {
    onClick: () => void;
    isPending: boolean;
  };
  updateButton?: {
    onClick: () => void;
    isPending: boolean;
    isDisabled: boolean;
  };
};

export function ModuleCardUI(props: ModuleCardUIProps) {
  return (
    <section className="rounded-lg border border-border bg-muted/50">
      {/* Header */}
      <div className="relative p-4 lg:p-6">
        {/* Title */}
        <div className="pr-14">
          <h3 className="mb-1 gap-2 font-semibold text-xl tracking-tight">
            {props.contractInfo.name}

            {/* Info Dialog */}
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  className="absolute top-4 right-4 h-auto w-auto p-2 text-muted-foreground"
                >
                  <InfoIcon className="size-5" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{props.contractInfo.name}</DialogTitle>
                  <DialogDescription>
                    {props.contractInfo.description}
                  </DialogDescription>

                  {/* Avoid adding focus on other elements to prevent tooltips from opening on modal open */}
                  <input className="sr-only" aria-hidden />

                  <div className="h-2" />

                  <div className="flex flex-col gap-4">
                    {props.contractInfo.version && (
                      <div>
                        <p className="text-muted-foreground text-sm">
                          {" "}
                          Version{" "}
                        </p>
                        <p> {props.contractInfo.version}</p>
                      </div>
                    )}

                    {props.contractInfo.publisher && (
                      <div>
                        <p className="text-muted-foreground text-sm">
                          Published By
                        </p>
                        <WalletAddress address={props.contractInfo.publisher} />
                      </div>
                    )}

                    <div>
                      <p className="mb-1 text-muted-foreground text-sm">
                        Module Address
                      </p>
                      <CopyAddressButton
                        className="text-xs"
                        address={props.moduleAddress}
                        copyIconPosition="left"
                        variant="outline"
                      />
                    </div>
                  </div>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </h3>

          {/* Description */}
          <p className="text-muted-foreground">
            {props.contractInfo.description}
          </p>
        </div>

        {props.children ? (
          <>
            <div className="h-5" />
            {props.children}
          </>
        ) : null}
      </div>

      <div className="flex flex-row justify-end gap-3 border-border border-t p-4 lg:p-6">
        <Button
          size="sm"
          onClick={props.uninstallButton.onClick}
          variant="destructive"
          className="min-w-24 gap-2"
          disabled={!props.isOwnerAccount}
        >
          {props.uninstallButton.isPending && <Spinner className="size-4" />}
          Uninstall
        </Button>

        {props.isOwnerAccount && props.updateButton && (
          <Button
            size="sm"
            className="min-w-24 gap-2"
            type="submit"
            onClick={props.updateButton.onClick}
            disabled={props.updateButton.isPending || !props.isOwnerAccount}
          >
            {props.updateButton.isPending && <Spinner className="size-4" />}
            Update
          </Button>
        )}
      </div>
    </section>
  );
}
