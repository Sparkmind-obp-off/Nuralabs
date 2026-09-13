PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS tenants (
  id TEXT PRIMARY KEY,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  external_identity TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (tenant_id) REFERENCES tenants(id)
);
CREATE TABLE IF NOT EXISTS tasks (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  original_request TEXT NOT NULL,
  status TEXT NOT NULL CHECK(status IN ('pending','planning','awaiting_approval','running','validating','completed','failed','cancelled')),
  autonomy_level INTEGER NOT NULL DEFAULT 1,
  plan_json TEXT,
  checkpoint_json TEXT,
  budget_limit_usd REAL NOT NULL DEFAULT 0.25,
  budget_used_usd REAL NOT NULL DEFAULT 0,
  cancellation_requested INTEGER NOT NULL DEFAULT 0,
  deliberate_failure INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  started_at TEXT,
  completed_at TEXT,
  failure_summary TEXT,
  FOREIGN KEY (tenant_id) REFERENCES tenants(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);
CREATE INDEX IF NOT EXISTS idx_tasks_tenant_created ON tasks(tenant_id, created_at DESC);
CREATE TABLE IF NOT EXISTS task_steps (
  id TEXT PRIMARY KEY,
  task_id TEXT NOT NULL,
  sequence INTEGER NOT NULL,
  step_type TEXT NOT NULL,
  status TEXT NOT NULL,
  tool_used TEXT,
  model_used TEXT,
  input_ref TEXT,
  output_ref TEXT,
  retry_count INTEGER NOT NULL DEFAULT 0,
  started_at TEXT,
  completed_at TEXT,
  error TEXT,
  metadata_json TEXT,
  UNIQUE(task_id, sequence),
  FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS artifacts (
  id TEXT PRIMARY KEY,
  task_id TEXT NOT NULL,
  tenant_id TEXT NOT NULL,
  type TEXT NOT NULL,
  filename TEXT NOT NULL,
  content TEXT NOT NULL,
  storage_ref TEXT NOT NULL,
  provenance_json TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS audit_events (
  id TEXT PRIMARY KEY,
  task_id TEXT,
  tenant_id TEXT NOT NULL,
  actor TEXT NOT NULL,
  event_type TEXT NOT NULL,
  metadata_json TEXT NOT NULL,
  timestamp TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_audit_task ON audit_events(task_id, timestamp);
