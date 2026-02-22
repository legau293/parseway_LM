import { OrgTree, InsuranceObject } from '@/data/mockOrgTree';

export interface NodeProgress {
  verified: number;
  total: number;
  pct: number;
}

function calcPct(verified: number, total: number): number {
  return total === 0 ? 0 : Math.round((verified / total) * 100);
}

function sumObjects(objs: InsuranceObject[]): { verified: number; total: number } {
  return objs.reduce(
    (acc, o) => ({ verified: acc.verified + o.fieldsVerified, total: acc.total + o.fieldsTotal }),
    { verified: 0, total: 0 }
  );
}

export function getRootCompanyProgress(rootId: string, tree: OrgTree): NodeProgress {
  const root = tree[rootId];
  if (!root) return { verified: 0, total: 0, pct: 0 };
  const { verified: rv, total: rt } = sumObjects(root.rootInsuranceObjects);
  let verified = rv;
  let total = rt;
  for (const sub of root.subsidiaries) {
    const { verified: sv, total: st } = sumObjects(sub.insuranceObjects);
    verified += sv;
    total += st;
  }
  return { verified, total, pct: calcPct(verified, total) };
}

export function getSubsidiaryProgress(
  rootId: string,
  subsidiaryId: string,
  tree: OrgTree
): NodeProgress {
  const root = tree[rootId];
  if (!root) return { verified: 0, total: 0, pct: 0 };
  const sub = root.subsidiaries.find((s) => s.id === subsidiaryId);
  if (!sub) return { verified: 0, total: 0, pct: 0 };
  const { verified, total } = sumObjects(sub.insuranceObjects);
  return { verified, total, pct: calcPct(verified, total) };
}

export function getNodeProgress(nodeId: string, tree: OrgTree): NodeProgress {
  return getRootCompanyProgress(nodeId, tree);
}

export function getDirectObjectsProgress(
  rootId: string,
  subsidiaryId: string | null,
  tree: OrgTree
): NodeProgress {
  const root = tree[rootId];
  if (!root) return { verified: 0, total: 0, pct: 0 };
  const objs =
    subsidiaryId === null
      ? root.rootInsuranceObjects
      : (root.subsidiaries.find((s) => s.id === subsidiaryId)?.insuranceObjects ?? []);
  const { verified, total } = sumObjects(objs);
  return { verified, total, pct: calcPct(verified, total) };
}
