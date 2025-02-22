"use client";

import { WithEngineInstance } from "components/engine/EnginePageLayout";
import type { EngineInstancePageProps } from "../types";
import { EngineAccessTokens } from "./components/engine-access-tokens";

export default function Page(props: EngineInstancePageProps) {
  const { params } = props;
  return (
    <WithEngineInstance
      engineId={params.engineId}
      content={(res) => <EngineAccessTokens instanceUrl={res.instance.url} />}
      rootPath={`/team/${params.team_slug}/${params.project_slug}/engine`}
    />
  );
}
