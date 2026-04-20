-- Этап 2 HomeTalk: прочтения, доставка, приватность прочтений
-- Копия из репозитория HomeTalk. Применять к БД мессенджера (не к сайту agrobuild1).
alter table app_users
  add column if not exists hide_read_receipts boolean not null default false;

alter table chat_members
  add column if not exists last_read_message_id uuid null;

alter table chat_members
  add column if not exists last_read_at timestamptz null;

alter table messages
  add column if not exists delivered_at timestamptz null;
