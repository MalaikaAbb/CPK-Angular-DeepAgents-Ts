/**
 * "Build a headless chat". No CopilotKit chrome: the transcript and composer
 * are hand-written over `injectAgentStore`, and the run is driven through
 * `CopilotKitCore.runAgent`. The one deviation from the guide's snippet is the
 * role filter on the transcript — see `transcript` below.
 * https://docs.copilotkit.ai/angular/deepagents/guides/threads-memory-attachments-headless
 */
import { Component, computed, inject, signal } from '@angular/core';
import { CopilotKit, injectAgentStore } from '@copilotkit/angular';

@Component({
  selector: 'app-headless-chat',
  template: `
    <div aria-live="polite">
      @for (message of transcript(); track message.id) {
        <article [attr.data-role]="message.role">
          {{ message.content }}
        </article>
      }
      @if (store().isRunning()) {
        <p>Agent is working…</p>
      }
    </div>

    <textarea
      aria-label="Message"
      [value]="draft()"
      (input)="updateDraft($event)"
    ></textarea>
    <button
      type="button"
      [disabled]="store().isRunning() || !draft().trim()"
      (click)="send()"
    >
      Send
    </button>
  `,
})
export class HeadlessChatComponent {
  private readonly copilotKit = inject(CopilotKit);
  readonly store = injectAgentStore('default');
  readonly draft = signal('');

  /**
   * `store().messages()` is the agent's whole message list, not a transcript:
   * the DeepAgents graph carries system and developer messages in its state —
   * including the "App Context:" one CopilotKit injects — plus tool results and
   * reasoning. `copilot-chat` filters those out for you; a headless transcript
   * has to do it itself, so this keeps only what a reader should see.
   */
  protected readonly transcript = computed(() =>
    this.store()
      .messages()
      .filter(
        (message) => message.role === 'user' || message.role === 'assistant',
      ),
  );

  protected updateDraft(event: Event): void {
    this.draft.set((event.target as HTMLTextAreaElement).value);
  }

  protected async send(): Promise<void> {
    const content = this.draft().trim();
    if (!content || this.store().isRunning()) return;

    const agent = this.store().agent;
    agent.addMessage({
      id: crypto.randomUUID(),
      role: 'user',
      content,
    });
    this.draft.set('');
    await this.copilotKit.core.runAgent({ agent });
  }
}
