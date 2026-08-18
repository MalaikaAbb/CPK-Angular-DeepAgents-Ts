# Doc drift changelog

What the CopilotKit docs changed under this repo, written by the sync on
`/doc-sync`. Only pages that actually moved are recorded — a sync that finds
everything unchanged writes nothing here at all.

Holds the 3 most recent dated entries. When a change lands on a fourth
date, the oldest entry is dropped. Entries are counted, not aged, so a gap of
weeks between changes does not expire anything.

## 2026-08-18

### 06:48 UTC — 1 page, highest severity high

**High — Chat UI and customization** · _local snapshot edit, not an upstream change_

`/angular/deepagents/guides/chat-ui` · route `/chat-ui` · under “Choose a chat surface”

3 code lines, 2 prose lines changed.

````diff
+ | `CopilotChatView` | You own the agent wiring and only need the chat layout. |
+ 
+ <section class="chat-shell" aria-label="Support assistant">
+ <copilot-chat agentId="support" />
+ </section>
````
