// Book #2 "Explore what Binance Agentic Wallet can do", 12 pages (owner's spec 2026-11-24; reworked for beginners 2026-11-28 with drawn pictures).
// No track, no gas page. Saves at pages 4, 8, 12 (cumulative masks 0x00F, 0x0FF, 0xFFF); the last one issues the certificate.
import type { ReactNode } from "react";
import { ArrowLeftRight, Bot, Clock, Coins, FileCheck, Landmark, Store, Target, Wallet } from "lucide-react";
import { useT } from "../i18n";
import { Ask, H1, H2, List, Ok, P, Rich, SaveHelp, SaveStep, Say, Steps, type BookContent, type Ctx, type TitleRef } from "./Pages";
import { Fig, Flow, Note, Rows } from "./Art";

const H3 = ({ text }: { text: string }) => <h3 className="t-header">{text}</h3>;
const Read = ({ text }: { text: string }) => <p className="t-content bk-read"><Rich text={text} /></p>;

function useNames() {
  const t = useT();
  return [
    t("Receive and send", "Nhận và gửi"),
    t("See your wallet", "Xem ví của bạn"),
    t("Swaps and limit orders", "Mua bán và lệnh limit"),
    t("Quotes, orders and save 1", "Báo giá, xem lệnh và ký lần 1"),
    t("What is DeFi?", "DeFi là gì?"),
    t("See DeFi in your wallet", "Xem DeFi trong ví"),
    t("Prediction and x402", "Dự đoán và x402"),
    t("See your limits and save 2", "Xem hạn mức và ký lần 2"),
    t("Approvals and pending transactions", "Cấp quyền và giao dịch đang chờ"),
    t("See approvals and pending transactions", "Xem quyền đã cấp và giao dịch đang chờ"),
    t("Your wallet map", "Bản đồ ví của bạn"),
    t("Safety check and save 3", "Kiểm tra an toàn và ký lần 3"),
  ];
}

const useSaveIntro = () => {
  const t = useT();
  return t("Tap Copy below, paste it to your AI, send. Developer Mode must be on; expired? Turn it on again as in Course 1, page 12.", "Bấm Chép bên dưới, dán cho AI, rồi gửi. Developer Mode phải đang bật; hết hạn thì bật lại như Khóa học 1, trang 12.");
};

function Page1({ titleRef }: TitleRef) {
  const t = useT();
  const n = useNames();
  return <>
    <H1 text={n[0]} titleRef={titleRef} />
    <H3 text={t("Receive", "Nhận")} />
    <List items={[
      t("You give your wallet address to the sender.", "Bạn đưa địa chỉ ví cho người gửi."),
      t("They must send on the right network. For example, USDT on BNB Smart Chain only arrives through the BNB Smart Chain network. Sending on the wrong network can lose the money.", "Họ phải gửi đúng mạng. Ví dụ USDT trên BNB Smart Chain chỉ nhận đúng qua mạng BNB Smart Chain. Gửi nhầm mạng thì có thể mất tiền."),
    ]} />
    <H3 text={t("Send", "Gửi")} />
    <List items={[
      t("Tell your AI 4 things: which address, which token, how much, on which network.", "Bạn nói với AI 4 điều: gửi cho địa chỉ nào, gửi token gì, gửi bao nhiêu, qua mạng nào."),
      t("Sending costs a little gas, paid in the network's own token: BNB on BNB Smart Chain, ETH on Ethereum, SOL on Solana.", "Gửi tốn một chút gas, trả bằng token gốc của mạng đó: mạng BNB Smart Chain trả bằng BNB, Ethereum trả bằng ETH, Solana trả bằng SOL."),
    ]} />
    <Fig>
      <div className="art-win art-body">
        <p className="sw-label">{t("Example: the 4 things to tell your AI", "Ví dụ: 4 điều cần nói với AI")}</p>
        <Rows rows={[[t("1 · To address", "1 · Địa chỉ nhận"), "0x12ab…9f3c"], [t("2 · Token", "2 · Token"), "USDT"], [t("3 · Amount", "3 · Số lượng"), "5"], [t("4 · Network", "4 · Mạng"), "BNB Smart Chain"]]} />
      </div>
    </Fig>
    <P text={t("**Once sent, it can't be taken back.** One wrong character in the address and the money is gone.", "**Gửi xong là không lấy lại được.** Sai một ký tự trong địa chỉ là tiền đi mất.")} />
    <H3 text={t("Does the AI just do it, or ask again?", "AI làm luôn hay hỏi lại?")} />
    <P text={t("Small tasks within your limit, the AI sends right away without asking. Over the limit, it is refused or you are asked again.", "Việc nhỏ trong hạn mức thì AI gửi luôn, không hỏi lại. Vượt hạn mức thì bị từ chối hoặc hỏi lại.")} />
  </>;
}

function Page2() {
  const t = useT();
  const n = useNames();
  return <>
    <H2 text={n[1]} />
    <P text={t("Two questions to see what's in your wallet. Nothing is sent or traded.", "Hai câu hỏi để xem ví có gì. Không gửi, không mua bán gì cả.")} />
    <Steps>
      <Ask title={t("See your tokens", "Xem các token")} q={t("Which tokens are in my wallet?", "Ví của tôi đang có những token nào?")}
        reply={<><Say text={t("Your wallet has (BNB Smart Chain):", "Ví của bạn có (BNB Smart Chain):")} /><Rows rows={[["BNB", t("0.00024 · ≈ 0.13 USD", "0,00024 · ≈ 0,13 USD")], [t("Total", "Tổng"), t("≈ 0.13 USD", "≈ 0,13 USD")]]} /></>}
        ok={t("Your AI lists each token in the wallet with amount, price and USD value, plus the total. Tokens under 0.01 USD are hidden by default.", "AI liệt kê từng token trong ví, gồm số lượng, giá và giá trị USD, kèm tổng giá trị. Token dưới 0,01 USD bị ẩn mặc định.")} />
      <Ask title={t("See your history", "Xem lịch sử")} q={t("What is my recent transaction history?", "Lịch sử giao dịch gần đây của tôi là gì?")}
        reply={<><Say text={t("Recent transactions on BSC:", "Giao dịch gần đây trên BSC:")} /><Rows rows={[[t("27/11 07:57 · contract call", "27/11 07:57 · contract call"), t("confirmed · fee 0.0000125 BNB", "confirmed · phí 0,0000125 BNB"), true]]} /></>}
        ok={t("Your AI lists recent transactions, each with its time, confirmed status and fee. Your progress save from Course 1 is in this list; it shows as a contract call.", "AI liệt kê các giao dịch gần đây, mỗi giao dịch có giờ, trạng thái confirmed và phí. Lần lưu tiến độ ở Khóa học 1 nằm trong danh sách này, hiện là một contract call.")}>
        <Read text={t("“Confirmed” = done and written on the blockchain.", "“Confirmed” = đã xong, đã ghi lên blockchain.")} />
      </Ask>
    </Steps>
    <Note />
  </>;
}

function Page3({ titleRef }: TitleRef) {
  const t = useT();
  const n = useNames();
  return <>
    <H1 text={n[2]} titleRef={titleRef} />
    <H3 text={t("Swap (trade now)", "Swap (đổi ngay)")} />
    <List items={[
      t("A swap trades one token for another at the current price, e.g. BNB to USDT.", "Swap là đổi token này sang token khác theo giá hiện tại, ví dụ BNB sang USDT."),
      t("Before trading, the AI gives a quote. A quote is only an estimate; the real price can move a little when the order is placed.", "Trước khi đổi, AI báo giá. Báo giá chỉ là ước tính, giá thật có thể lệch chút lúc đặt lệnh."),
      t("How much movement you accept is called slippage, set automatically to 0.5%.", "Mức lệch bạn chấp nhận gọi là slippage, tự động đặt ở 0,5%."),
      t("Trading a very small amount means fees take most of it.", "Đổi số tiền quá nhỏ thì phí chiếm phần lớn."),
    ]} />
    <Fig><Flow items={[[Coins, "BNB"], [ArrowLeftRight, t("swap at today's price", "đổi theo giá lúc này")], [Coins, "USDT"]]} /></Fig>
    <H3 text={t("Limit order (price target)", "Lệnh limit (hẹn giá)")} />
    <List items={[
      t("You pick the price you want. When the price hits it, the wallet buys or sells by itself.", "Bạn chọn giá mong muốn. Giá chạm mức đó thì ví tự mua hoặc bán."),
      t("Until the price hits it, the order waits.", "Giá chưa chạm thì lệnh nằm chờ."),
    ]} />
    <Fig><Flow items={[[Target, t("You pick a price", "Bạn chọn giá")], [Clock, t("The order waits", "Lệnh nằm chờ")], [Wallet, t("Price hits it: the wallet trades", "Giá chạm: ví tự mua/bán")]]} /></Fig>
    <P text={t("Swaps and limit orders both count toward the general trading limit.", "Swap và lệnh limit cùng tính vào hạn mức giao dịch chung.")} />
    <P text={t("**Risk:** prices go up and down. Trading can lose money.", "**Rủi ro:** giá lên xuống liên tục. Mua bán có thể lỗ.")} />
  </>;
}

function Page4({ save }: Pick<Ctx, "save">) {
  const t = useT();
  const n = useNames();
  const me = t("Save my learning progress on Agent Academy: finished reading pages 1 to 4 of course 2.", "Lưu tiến độ học bài của tôi trên Agent Academy: đã đọc xong trang 1 đến 4 của khóa học 2.");
  return <>
    <H2 text={n[3]} />
    <P text={t("Steps 1–2 only look, nothing is traded. Step 3 saves your progress.", "Bước 1–2 chỉ xem, không mua bán gì. Bước 3 lưu tiến độ học.")} />
    <Steps>
      <Ask title={t("Ask for a quote (just look)", "Hỏi báo giá (chỉ xem)")} q={t("Quote swapping 0.0001 BNB to USDT. Just show me, don't do it.", "Báo giá đổi 0,0001 BNB sang USDT. Chỉ xem, đừng thực hiện.")}
        reply={<Say text={t("0.0001 BNB ≈ 0.0551 USDT, slippage 0.5%. This is only a quote; no order was placed.", "0,0001 BNB ≈ 0,0551 USDT, slippage 0,5%. Đây chỉ là báo giá, chưa đặt lệnh nào.")} />}
        ok={t("Your AI gives the estimated USDT you'd get (about 0.055 USDT; it changes with the BNB price) and 0.5% slippage. No order has been placed.", "AI báo số USDT nhận được ước tính (khoảng 0,055 USDT; số này đổi theo giá BNB) và slippage 0,5%. Chưa có lệnh nào được thực hiện.")}>
        <Read text={t("“Just show me, don't do it” makes the AI only quote, not trade. This lesson has no real swap.", "Câu \"Chỉ xem, đừng thực hiện\" để AI chỉ báo giá, không đổi thật. Bài học này không đổi thật.")} />
      </Ask>
      <Ask title={t("Check for waiting orders", "Xem lệnh đang chờ")} q={t("Do I have any open limit orders?", "Tôi đang có lệnh limit nào chưa khớp?")}
        reply={<Say text={t("No limit orders waiting.", "Không có lệnh limit nào đang chờ.")} />}
        ok={t("Your AI says there are no limit orders waiting.", "AI báo không có lệnh limit nào đang chờ.")}>
        <Read text={t("A new wallet has no orders, so the list is empty.", "Ví mới chưa đặt lệnh nào nên danh sách trống.")} />
      </Ask>
      <SaveStep title={t("Save your progress (save 1 of 3)", "Lưu tiến độ (lần 1/3)")} me={me} block={save(0, me)} intro={useSaveIntro()} />
    </Steps>
    <SaveHelp />
    <Note />
  </>;
}

function Page5({ titleRef }: TitleRef) {
  const t = useT();
  const n = useNames();
  return <>
    <H1 text={n[4]} titleRef={titleRef} />
    <H3 text="DeFi" />
    <List items={[
      t("DeFi is financial services that run on the blockchain as programs (contracts), not through a bank.", "DeFi là các dịch vụ tài chính chạy trên blockchain bằng chương trình (hợp đồng), không qua ngân hàng."),
      t("With your AI's wallet, you can deposit tokens to earn interest, add liquidity, withdraw, and claim rewards.", "Với ví của AI, bạn có thể gửi token vào để nhận lãi, thêm thanh khoản, rút ra, và nhận thưởng."),
    ]} />
    <Fig><Flow items={[[Landmark, t("A bank: people run it", "Ngân hàng: người vận hành")], [FileCheck, t("DeFi: a program runs it", "DeFi: chương trình tự chạy")]]} /></Fig>
    <H3 text={t("Adding liquidity (LP)", "Thêm thanh khoản (LP)")} />
    <List items={[t("You put 2 kinds of tokens into a shared pool so others can trade between them. You get a share of the pool's fees.", "Bạn góp 2 loại token vào một kho chung để người khác đổi qua lại. Bạn nhận một phần phí của kho.")]} />
    <H3 text="APY" />
    <List items={[t("APY is the estimated interest over one year. It changes over time and is not guaranteed.", "APY là mức lãi ước tính trong một năm. Nó thay đổi theo thời gian, không được đảm bảo.")]} />
    <H3 text={t("Risk", "Rủi ro")} />
    <List items={[t("Contracts can have bugs, token prices can fall. You can lose part or all of what you deposited.", "Hợp đồng có thể lỗi, giá token có thể giảm. Bạn có thể mất một phần hoặc toàn bộ tiền đã gửi.")]} />
    <P text={t("DeFi has its own limit. Only deposits and adding liquidity count toward it.", "DeFi có hạn mức riêng. Chỉ việc gửi vào và thêm thanh khoản mới trừ vào hạn mức này.")} />
  </>;
}

function Page6() {
  const t = useT();
  const n = useNames();
  return <>
    <H2 text={n[5]} />
    <P text={t("Two questions, just looking. Nothing is deposited.", "Hai câu hỏi, chỉ xem. Không gửi tiền vào đâu cả.")} />
    <Steps>
      <Ask title={t("See your DeFi", "Xem DeFi của bạn")} q={t("What DeFi positions do I have?", "Vị thế DeFi của tôi hiện có gì?")}
        reply={<Say text={t("No DeFi positions yet. Total 0 USD.", "Chưa có vị thế DeFi nào. Tổng 0 USD.")} />}
        ok={t("Your AI says you have no DeFi positions yet, total value 0 USD.", "AI báo bạn chưa có vị thế DeFi nào, tổng giá trị 0 USD.")}>
        <Read text={t("“Position” = money you have put into DeFi.", "“Vị thế” = tiền bạn đang gửi trong DeFi.")} />
      </Ask>
      <Ask title={t("See what DeFi can do", "Xem DeFi làm được gì")} q={t("What DeFi tasks can this wallet do?", "Ví này làm được những việc DeFi nào?")}
        reply={<><Say text={t("Two groups of DeFi tasks:", "Hai nhóm việc DeFi:")} /><Rows rows={[[t("View", "Xem"), t("protocols, opportunities, positions, previews", "giao thức, cơ hội, vị thế, xem trước")], [t("Act", "Thao tác"), t("deposit, withdraw, add/remove liquidity, claim", "gửi, rút, thêm/rút thanh khoản, nhận thưởng")], [t("DeFi limit", "Hạn mức DeFi"), t("5,000 USD a day", "5.000 USD mỗi ngày")]]} /></>}
        ok={t("Your AI splits them into 2 groups. Viewing: protocol list, protocol details, investment opportunities, your positions, transaction previews. Actions: deposit, withdraw, add liquidity, remove liquidity, claim rewards. Plus the DeFi daily limit of 5,000 USD.", "AI chia làm 2 nhóm. Nhóm xem thông tin: danh sách giao thức, chi tiết giao thức, các cơ hội đầu tư, vị thế của bạn, xem trước giao dịch. Nhóm thao tác: gửi vào, rút, thêm thanh khoản, rút thanh khoản, nhận thưởng. Kèm hạn mức DeFi mỗi ngày là 5.000 USD.")} />
    </Steps>
    <Read text={t("If you have a balance, you can try it yourself. This lesson has no real DeFi practice. DeFi can lose money.", "Nếu có số dư, bạn có thể tự thử. Bài học này không có phần thực hành DeFi thật. DeFi có thể mất tiền.")} />
    <Note />
  </>;
}

function Page7({ titleRef }: TitleRef) {
  const t = useT();
  const n = useNames();
  return <>
    <H1 text={n[6]} titleRef={titleRef} />
    <H3 text={t("Prediction (prediction market)", "Dự đoán (prediction market)")} />
    <List items={[
      t("You pick an event that hasn't happened yet and buy the outcome you think is right. Right = you get paid; wrong = you lose what you paid.", "Bạn chọn một sự kiện chưa xảy ra và mua kết quả bạn nghĩ sẽ đúng. Đúng thì được trả tiền, sai thì mất số đã mua."),
      t("This feature is off by default. Prediction has its own limit.", "Mặc định tính năng này đang tắt. Dự đoán có hạn mức riêng."),
      t("In some countries, prediction is banned or restricted. Check your country's law before using it.", "Ở một số nước, dự đoán bị cấm hoặc hạn chế. Bạn tự kiểm tra luật nước mình trước khi dùng."),
    ]} />
    <H3 text="x402" />
    <List items={[
      t("x402 is a way for the AI to pay a small amount by itself to use a paid online service, e.g. a data source.", "x402 là cách AI tự trả một khoản nhỏ để dùng dịch vụ có thu phí trên mạng, ví dụ một nguồn dữ liệu."),
      t("x402 has its own limit, 20 USD a day by default. There is no on/off switch, only the limit.", "x402 có hạn mức riêng, mặc định 20 USD mỗi ngày. Không có công tắc bật tắt, chỉ có hạn mức."),
    ]} />
    <Fig><Flow items={[[Bot, t("AI needs paid data", "AI cần dữ liệu có phí")], [Coins, t("pays a small amount", "tự trả khoản nhỏ")], [Store, t("gets the data", "nhận dữ liệu")]]} /></Fig>
    <P text={t("This lesson only introduces these two features, no practice.", "Bài học này chỉ giới thiệu hai tính năng này, không thực hành.")} />
  </>;
}

function Page8({ save }: Pick<Ctx, "save">) {
  const t = useT();
  const n = useNames();
  const me = t("Save my learning progress on Agent Academy: finished reading pages 1 to 8 of course 2.", "Lưu tiến độ học bài của tôi trên Agent Academy: đã đọc xong trang 1 đến 8 của khóa học 2.");
  return <>
    <H2 text={n[7]} />
    <Steps>
      <Ask title={t("Ask for these two limits", "Hỏi hai hạn mức này")} q={t("What are my Prediction and x402 limits?", "Hạn mức Dự đoán và x402 của tôi là bao nhiêu?")}
        reply={<Say text={t("Prediction: 5,000 USD a day, currently off. x402: 20 USD a day. 0 used. Both are separate from the general trading limit.", "Dự đoán: 5.000 USD mỗi ngày, đang tắt. x402: 20 USD mỗi ngày. Đã dùng 0. Cả hai tính riêng, không trừ vào hạn mức giao dịch chung.")} />}
        ok={t("Your AI gives the daily limit of both: Prediction 5,000 USD, x402 20 USD, 0 used. Prediction is off, so it can't be used yet. These two limits are separate and don't count toward the general trading limit.", "AI báo hạn mức mỗi ngày của hai loại: Dự đoán 5.000 USD, x402 20 USD, đã dùng 0. Dự đoán đang tắt nên chưa dùng được. Hai hạn mức này tính riêng, không trừ vào hạn mức giao dịch chung.")}>
        <Read text={t("“Separate” means using up the Prediction or x402 limit leaves the 50,000 USD general trading limit untouched.", "\"Tính riêng\" nghĩa là dùng hết hạn mức Dự đoán hay x402 thì hạn mức giao dịch chung 50.000 USD vẫn còn nguyên.")} />
      </Ask>
      <SaveStep title={t("Save your progress (save 2 of 3)", "Lưu tiến độ (lần 2/3)")} me={me} block={save(1, me)} intro={useSaveIntro()} />
    </Steps>
    <SaveHelp />
    <Note />
  </>;
}

function Page9({ titleRef }: TitleRef) {
  const t = useT();
  const n = useNames();
  return <>
    <H1 text={n[8]} titleRef={titleRef} />
    <H3 text={t("Approvals", "Cấp quyền")} />
    <List items={[
      t("To use your tokens, an app (e.g. an app that trades one token for another) needs your permission first. Giving that permission is called an approval.", "Muốn dùng token của bạn, một ứng dụng (ví dụ ứng dụng đổi token này sang token khác) phải được bạn cho phép trước. Việc cho phép đó gọi là cấp quyền."),
      t("Like letting a shop charge your card by itself.", "Giống như bạn cho một cửa hàng quyền tự trừ tiền trong thẻ của bạn."),
      t("An approval can allow a set amount, or an unlimited amount.", "Quyền có thể chỉ cho dùng một số lượng, hoặc cho dùng không giới hạn."),
      t("If an approval stays open after you're done, the app can still take your tokens. So revoke approvals you no longer use.", "Dùng xong mà quyền còn mở, ứng dụng vẫn có thể lấy token của bạn. Vì vậy quyền không dùng nữa thì nên thu hồi."),
      t("The AI only revokes when you confirm.", "AI chỉ thu hồi khi bạn xác nhận."),
    ]} />
    <Fig><Flow items={[[Wallet, t("Your wallet", "Ví của bạn")], [FileCheck, t("gives permission", "cấp quyền")], [Store, t("the app can take tokens", "ứng dụng lấy được token")]]} /></Fig>
    <H3 text={t("Pending transactions", "Giao dịch đang chờ")} />
    <List items={[
      t("A transaction sent to the blockchain takes a moment to finish. Until then, it is pending.", "Gửi giao dịch lên blockchain cần một lúc mới xong. Lúc chưa xong, giao dịch đang chờ."),
      t("UNLOCKED means nothing is pending. The wallet is ready for something new.", "Ví báo UNLOCKED nghĩa là không có gì đang chờ. Ví sẵn sàng làm việc mới."),
    ]} />
  </>;
}

function Page10() {
  const t = useT();
  const n = useNames();
  return <>
    <H2 text={n[9]} />
    <P text={t("Two safety questions. Nothing is changed.", "Hai câu hỏi an toàn. Không thay đổi gì.")} />
    <Steps>
      <Ask title={t("See your approvals", "Xem quyền đã cấp")} q={t("Which contracts has my wallet given approvals to?", "Ví của tôi đã cấp quyền cho những hợp đồng nào?")}
        reply={<Say text={t("No approvals.", "Chưa cấp quyền nào.")} />}
        ok={t("Your AI says the wallet hasn't approved any token for any contract.", "AI báo ví không cấp quyền token nào cho hợp đồng nào.")}>
        <Read text={t("A new wallet has no approvals. If it has some later, the AI can show each one and revoke it after you confirm.", "Ví mới chưa cấp quyền nào. Nếu sau này có, AI xem được chi tiết từng quyền và thu hồi sau khi bạn xác nhận.")} />
      </Ask>
      <Ask title={t("See stuck transactions", "Xem giao dịch bị kẹt")} q={t("Which of my transactions are pending or stuck?", "Giao dịch nào của tôi đang chờ hoặc bị kẹt?")}
        reply={<><p className="art-status sw-label">UNLOCKED</p><Say text={t("Nothing pending.", "Không có gì đang chờ.")} /></>}
        ok={t("Your AI says no transactions are pending or stuck. The wallet status is UNLOCKED.", "AI báo không có giao dịch nào đang chờ hoặc bị kẹt. Trạng thái ví là UNLOCKED.")}>
        <Read text={t("UNLOCKED means the wallet is ready to send a new transaction.", "UNLOCKED nghĩa là ví sẵn sàng gửi giao dịch mới.")} />
      </Ask>
    </Steps>
    <Note />
  </>;
}

function Page11({ titleRef }: TitleRef) {
  const t = useT();
  const n = useNames();
  const rows: [string, string, string][] = [
    [t("General trading", "Giao dịch chung"), t("Send, swap tokens, place limit orders", "Gửi, đổi token (swap), đặt lệnh limit"), "50.000 USD"],
    ["DeFi", t("Deposit, withdraw, add liquidity, claim rewards", "Gửi vào, rút, thêm thanh khoản, nhận thưởng"), "5.000 USD"],
    [t("Prediction", "Dự đoán"), t("Buy the outcome of an event (off by default)", "Mua kết quả của sự kiện (mặc định tắt)"), "5.000 USD"],
    ["x402", t("Pay small amounts to use paid services", "Tự trả khoản nhỏ để dùng dịch vụ có phí"), "20 USD"],
    ["Developer Mode", t("Sign contracts, like saving your progress", "Ký hợp đồng, như lưu tiến độ học bài"), "1.000 USD"],
  ];
  const money = (s: string) => t(s.replace(".", ","), s); // EN: 50,000 USD
  return <>
    <H1 text={n[10]} titleRef={titleRef} />
    <P text={t("The AI can do many things with the wallet; each kind of task has its own limit:", "AI làm được nhiều việc với ví, mỗi loại việc có hạn mức riêng:")} />
    <table className="bk-table t-content">
      <thead><tr><th>{t("Task type", "Loại việc")}</th><th>{t("What it can do", "Làm được gì")}</th><th>{t("Daily limit", "Hạn mức mỗi ngày")}</th></tr></thead>
      <tbody>{rows.map(([a, b, c]) => <tr key={a}><td>{a}</td><td>{b}</td><td className="bk-num">{money(c)}</td></tr>)}</tbody>
    </table>
    <P text={t("The wallet keeps money safe because:", "Ví giữ tiền an toàn nhờ:")} />
    <List items={[
      t("Unusual transactions are refused automatically.", "Giao dịch bất thường bị tự động từ chối."),
      t("Only tokens on the allowed list can be traded.", "Chỉ giao dịch các token trong danh sách cho phép."),
      t("The AI doesn't hold the wallet's key.", "AI không cầm chìa của ví."),
      t("Only you can change the rules, in the Binance App.", "Chỉ bạn đổi được luật, trong Binance App."),
    ]} />
  </>;
}

function Page12({ save, status }: Pick<Ctx, "save" | "status">) {
  const t = useT();
  const n = useNames();
  const me = t("Save my learning progress on Agent Academy: finished reading pages 1 to 12 of course 2.", "Lưu tiến độ học bài của tôi trên Agent Academy: đã đọc xong trang 1 đến 12 của khóa học 2.");
  return <>
    <H2 text={n[11]} />
    <Steps>
      <Ask title={t("Run a safety check", "Kiểm tra an toàn")} q={t("Run a safety check on my wallet.", "Kiểm tra an toàn ví của tôi.")}
        reply={<><Rows rows={[[t("Connection", "Kết nối"), "CONNECTED", true], [t("Approvals", "Cấp quyền"), t("None", "Không có"), true], [t("Pending", "Đang chờ"), "UNLOCKED", true], [t("Limits", "Hạn mức"), t("0 used", "Đã dùng 0"), true]]} /><Say text={t("Nothing unusual. Developer Mode is on: turn it off in the app when you're done.", "Không thấy gì bất thường. Developer Mode đang bật: học xong thì tắt trong app.")} /></>}
        ok={t("Your AI checks connection, approvals, pending transactions, balances, limits and Developer Mode, then says it found nothing unusual.", "AI kiểm tra kết nối, quyền đã cấp, giao dịch đang chờ, số dư, hạn mức và Developer Mode, rồi báo không thấy gì bất thường.")}>
        <Read text={t("It only reports what it could check. It may suggest turning off Developer Mode or lowering high limits (change them in the Binance App).", "AI chỉ báo những gì kiểm tra được. Nó có thể khuyên tắt Developer Mode hoặc hạ hạn mức cao (đổi trong Binance App).")} />
      </Ask>
      <SaveStep title={t("Save and get your certificate (save 3 of 3)", "Lưu và nhận chứng chỉ (lần 3/3)")} me={me} block={save(2, me)} intro={useSaveIntro()} />
    </Steps>
    <Ok text={t("Your AI says it's saved. Your certificate opens.", "AI báo đã lưu xong. Chứng chỉ hiện ra.")} />
    {status as ReactNode}
    <P text={t("Done? Turn off Developer Mode in the Binance App if you won't use it.", "Xong rồi thì tắt Developer Mode trong Binance App nếu không dùng nữa.")} />
    <SaveHelp />
    <Note />
  </>;
}

export const book2: BookContent = {
  saves: [0x00fn, 0x0ffn, 0xfffn], // pages 4, 8, 12 (the contract keeps bits already saved)
  usePageNames: () => useNames(),
  page: (p, which, c) => {
    switch (`${p}${which[0]}`) {
      case "0l": return <Page1 titleRef={c.titleRef} />;
      case "0p": return <Page2 />;
      case "1l": return <Page3 titleRef={c.titleRef} />;
      case "1p": return <Page4 save={c.save} />;
      case "2l": return <Page5 titleRef={c.titleRef} />;
      case "2p": return <Page6 />;
      case "3l": return <Page7 titleRef={c.titleRef} />;
      case "3p": return <Page8 save={c.save} />;
      case "4l": return <Page9 titleRef={c.titleRef} />;
      case "4p": return <Page10 />;
      case "5l": return <Page11 titleRef={c.titleRef} />;
      default: return <Page12 save={c.save} status={c.status} />;
    }
  },
};
