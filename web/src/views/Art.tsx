// Drawn lesson pictures (owner 2026-11-28): generic, not screenshots, so no real wallet data and no copy of any app's UI.
import type { ReactNode } from "react";
import { ArrowRight, Bot, Check, Lock, Monitor, Pointer, Smartphone, X, type LucideIcon } from "lucide-react";
import { useT } from "../i18n";

/** A step: where to do it, short title + words/prompt on the left, an example picture on the right (below on phones). */
export function Step({ on, title, art, children }: { on: "pc" | "phone" | "any" | "ai"; title: string; art?: ReactNode; children?: ReactNode }) {
  const t = useT();
  const where = { pc: [Monitor, t("On your computer", "Trên máy tính")], phone: [Smartphone, t("On your phone", "Trên điện thoại")], any: [Monitor, t("Computer or phone", "Máy tính hoặc điện thoại")], ai: [Bot, t("In the chat with your AI", "Trong khung chat với AI")] } as const;
  const [Icon, label] = where[on];
  return (
    <li>
      <div className={art ? "art-step" : "art-step solo"}>
        <div className="art-words">
          <p className="art-where sw-label"><Icon size={12} aria-hidden /> {label}</p>
          <p className="t-content"><strong>{title}</strong></p>{children}
        </div>
        {art && <figure className="art"><figcaption className="sw-label">{t("Example picture", "Hình ví dụ")}</figcaption>{art}</figure>}
      </div>
    </li>
  );
}

/** Before step 1: what to have ready. */
export function Need({ items, children }: { items: ["pc" | "phone" | "ai", string][]; children?: ReactNode }) {
  const t = useT();
  const icons = { pc: Monitor, phone: Smartphone, ai: Bot };
  return (
    <div className="art-need">
      <p className="sw-label">{t("Get these ready", "Chuẩn bị trước")}</p>
      <ul>{items.map(([k, text]) => { const Icon = icons[k]; return <li key={text} className="t-content"><span className="art-face"><Icon size={16} aria-hidden /></span>{text}</li>; })}</ul>
      {children}
    </div>
  );
}

/** Fixes for the places people get stuck. Closed until tapped. */
export function Help({ items }: { items: [string, string][] }) {
  const t = useT();
  return (
    <div className="art-help">
      <p className="sw-label">{t("Stuck? Tap your problem", "Bị kẹt? Bấm vào lỗi của bạn")}</p>
      {items.map(([q, a]) => <details key={q}><summary className="t-content">{q}</summary><p className="t-content">{a}</p></details>)}
    </div>
  );
}

/** What the learner says (yellow, right) and what the AI answers (white, left). */
export function Chat({ me, children }: { me?: string; children: ReactNode }) {
  const t = useT();
  return (
    <div className="art-win">
      <div className="art-body">
        {me && <><p className="art-who art-who-me sw-label">{t("You send", "Bạn gửi")}</p><p className="art-me t-content">{me}</p><p className="sw-label">{t("AI replies", "AI trả lời")}</p></>}
        <div className="art-ai"><span className="art-face"><Bot size={16} aria-label="AI" /></span><div className="art-bubble">{children}</div></div>
      </div>
    </div>
  );
}

export function Window({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="art-win">
      <div className="art-bar"><i /><i /><i /><span className="sw-label">{label}</span></div>
      <div className="art-body">{children}</div>
    </div>
  );
}

export function Phone({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="art-phone">
      <p className="art-phone-top sw-label"><Smartphone size={12} aria-hidden /> {title}</p>
      <div className="art-body">{children}</div>
    </div>
  );
}

export const Btn = ({ text }: { text: string }) => <p className="art-btn sw-label">{text} <Pointer size={16} aria-hidden /></p>;
export const Toggle = ({ text }: { text: string }) => <p className="art-row t-content"><span>{text}</span><span className="art-toggle" aria-label="on"><i /></span></p>;
export const Tick = ({ text }: { text: string }) => <p className="art-tick t-content"><span><Check size={12} aria-hidden /></span>{text}</p>;

/** The same code on both screens = confirm. Different = don't. */
export function CodeMatch({ code, other }: { code: string; other: string }) {
  const t = useT();
  const pair = (b: string, ok: boolean) => (
    <div className={ok ? "art-case" : "art-case no"}>
      <div className="art-pair">
        <div><p className="sw-label">{t("Computer", "Máy tính")}</p><p className="sw-heading art-code">{code}</p></div>
        <div><p className="sw-label">{t("Phone", "Điện thoại")}</p><p className="sw-heading art-code">{b}</p></div>
      </div>
      <p className="art-verdict sw-label">{ok ? <Check size={16} aria-hidden /> : <X size={16} aria-hidden />} {ok ? t("Same: confirm", "Giống: xác nhận") : t("Different: stop", "Khác: dừng lại")}</p>
    </div>
  );
  return <div className="art-match">{pair(code, true)}{pair(other, false)}</div>;
}

export function Connected() {
  const t = useT();
  return <>
    <p className="art-status sw-label">CONNECTED</p>
    <p className="t-content">{t("The wallet is connected.", "Ví đã kết nối.")}</p>
  </>;
}

export const Secret = ({ text }: { text: string }) => <p className="art-tick t-content"><span><Lock size={12} aria-hidden /></span>{text}</p>;

/** A picture inside a learn page (not a step): caption + drawing. */
export function Fig({ children }: { children: ReactNode }) {
  const t = useT();
  return <figure className="art art-fig"><figcaption className="sw-label">{t("Picture", "Hình minh hoạ")}</figcaption>{children}</figure>;
}

/** Boxes in a row joined by arrows (a column on phones). */
export function Flow({ items }: { items: [LucideIcon, string][] }) {
  return (
    <ol className="art-flow">
      {items.map(([Icon, text], i) => <li key={text}>{i > 0 && <ArrowRight size={16} className="art-arrow" aria-hidden />}<span className="art-box t-content"><span className="art-face"><Icon size={16} aria-hidden /></span>{text}</span></li>)}
    </ol>
  );
}

/** A daily limit as a bar: used part black, the rest yellow. */
export function Meter({ limit, used, unit = "USD" }: { limit: number; used: number; unit?: string }) {
  const t = useT();
  const n = (x: number) => x.toLocaleString(t("en-US", "vi-VN"));
  return (
    <div className="art-win art-body">
      <p className="art-row t-content"><span>{t("Daily limit", "Hạn mức mỗi ngày")}</span><strong>{n(limit)} {unit}</strong></p>
      <div className="art-meter"><i style={{ width: `${(used / limit) * 100}%` }} /></div>
      <p className="art-row t-content"><span>{t("Used", "Đã dùng")} {n(used)}</span><strong>{t("Left", "Còn")} {n(limit - used)}</strong></p>
    </div>
  );
}

/** Label: value rows (a form, a reply, a table). `good` rows get a green tick. */
export function Rows({ rows }: { rows: [string, string, boolean?][] }) {
  return (
    <dl className="art-rows">
      {rows.map(([k, v, good]) => <div key={k}><dt className="sw-label">{k}</dt><dd className="t-content">{good && <Check size={16} className="art-good" aria-hidden />}{v}</dd></div>)}
    </dl>
  );
}

/** Saving progress: you send, AI shows a preview, you type confirm, done. */
export function Preview({ me }: { me: string }) {
  const t = useT();
  return (
    <div className="art-win art-body">
      <p className="art-who art-who-me sw-label">{t("1 · You send", "1 · Bạn gửi")}</p>
      <p className="art-me t-content">{me}</p>
      <p className="sw-label">{t("2 · AI shows a preview", "2 · AI cho xem trước")}</p>
      <Rows rows={[[t("Tokens leaving", "Token bị chuyển đi"), t("None", "Không có"), true], [t("Approvals", "Cấp quyền"), t("None", "Không có"), true], [t("Fee", "Phí"), t("A little gas", "Một chút gas")]]} />
      <p className="art-who art-who-me sw-label">{t("3 · You check, then type", "3 · Bạn kiểm tra rồi gõ")}</p>
      <p className="art-me t-content">{t("confirm", "xác nhận")}</p>
      <p className="art-ok t-content"><Check size={16} aria-hidden /> {t("4 · Saved", "4 · Đã lưu")}</p>
    </div>
  );
}

export const Note = () => {
  const t = useT();
  return <p className="art-note sw-label">{t("Pictures are drawings. Your screen may look different.", "Hình chỉ để minh hoạ. Màn hình thật có thể khác.")}</p>;
};
