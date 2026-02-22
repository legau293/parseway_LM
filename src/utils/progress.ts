import { OrgTree } from '@/data/mockOrgTree';

export interface NodeProgress {
  verified: number;
  total: number;
  pct: number;
}

function collectProgress(nodeId: string, tree: OrgTree, visited = new Set<string>()): { verified: number; total: number } {
  if (visited.has(nodeId)) return { verified: 0, total: 0 };
  visited.add(nodeId);

  const node = tree[nodeId];
  if (!node) return { verified: 0, total: 0 };

  let verified = 0;
  let total = 0;

  for (const obj of node.insuranceObjects) {
    verified += obj.fieldsVerified;
    total += obj.fieldsTotal;
  }

  for (const childId of node.childCompanyIds) {
    const child = collectProgress(childId, tree, visited);
    verified += child.verified;
    total += child.total;
  }

  return { verified, total };
}

export function getNodeProgress(nodeId: string, tree: OrgTree): NodeProgress {
  const { verified, total } = collectProgress(nodeId, tree);
  const pct = total === 0 ? 0 : Math.round((verified / total) * 100);
  return { verified, total, pct };
}

export function getDirectObjectsProgress(nodeId: string, tree: OrgTree): NodeProgress {
  const node = tree[nodeId];
  if (!node) return { verified: 0, total: 0, pct: 0 };
  let verified = 0;
  let total = 0;
  for (const obj of node.insuranceObjects) {
    verified += obj.fieldsVerified;
    total += obj.fieldsTotal;
  }
  const pct = total === 0 ? 0 : Math.round((verified / total) * 100);
  return { verified, total, pct };
}
