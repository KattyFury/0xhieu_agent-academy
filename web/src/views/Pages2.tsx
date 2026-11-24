// Book #2 "Explore what Binance Agentic Wallet can do", 12 pages (owner's spec 2026-11-24). Vietnamese = the owner's approved copy, word for word; English = translation.
// No track, no gas page. Saves at pages 4, 8, 12 (cumulative masks 0x00F, 0x0FF, 0xFFF); the last one issues the certificate.
import type { ReactNode } from "react";
import { useT } from "../i18n";
import { Code, H1, H2, List, Ok, P, Rich, S, Steps, type BookContent, type Ctx, type TitleRef } from "./Pages";

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
    <P text={t("Ask your AI:", "Hỏi AI:")} />
    <Code text={t("Which tokens are in my wallet?", "Ví của tôi đang có những token nào?")} />
    <Ok text={t("Your AI lists each token in the wallet with amount, price and USD value, plus the total. Tokens under 0.01 USD are hidden by default.", "AI liệt kê từng token trong ví, gồm số lượng, giá và giá trị USD, kèm tổng giá trị. Token dưới 0,01 USD bị ẩn mặc định.")} />
    <P text={t("Then ask:", "Hỏi tiếp:")} />
    <Code text={t("What is my recent transaction history?", "Lịch sử giao dịch gần đây của tôi là gì?")} />
    <Ok text={t("Your AI lists recent transactions, each with its time, confirmed status and fee. Your progress save from Course 1 is in this list.", "AI liệt kê các giao dịch gần đây, mỗi giao dịch có giờ, trạng thái confirmed và phí. Lần lưu tiến độ ở Khóa học 1 nằm trong danh sách này.")} />
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
    <H3 text={t("Limit order (price target)", "Lệnh limit (hẹn giá)")} />
    <List items={[
      t("You pick the price you want. When the price hits it, the wallet buys or sells by itself.", "Bạn chọn giá mong muốn. Giá chạm mức đó thì ví tự mua hoặc bán."),
      t("Until the price hits it, the order waits.", "Giá chưa chạm thì lệnh nằm chờ."),
    ]} />
    <P text={t("Swaps and limit orders both count toward the general trading limit.", "Swap và lệnh limit cùng tính vào hạn mức giao dịch chung.")} />
  </>;
}

function Page4({ save }: Pick<Ctx, "save">) {
  const t = useT();
  const n = useNames();
  return <>
    <H2 text={n[3]} />
    <Steps>
      <S text={t("Ask your AI:", "Hỏi AI:")}>
        <Code text={t("Quote swapping 0.0001 BNB to USDT. Just show me, don't do it.", "Báo giá đổi 0,0001 BNB sang USDT. Chỉ xem, đừng thực hiện.")} />
        <Ok text={t("Your AI gives the estimated USDT you'd get (about 0.055 USDT) and 0.5% slippage. No order has been placed.", "AI báo số USDT nhận được ước tính (khoảng 0,055 USDT) và slippage 0,5%. Chưa có lệnh nào được thực hiện.")} />
        <Read text={t("How to read it: “about” means an estimate; the real price can move. 0.5% slippage means the price may move at most 0.5%. “Just show me, don't do it” makes the AI only quote, not trade.", "Cách đọc: \"nhận khoảng\" là số ước tính, giá thật có thể lệch. Slippage 0,5% nghĩa là giá được phép lệch tối đa 0,5%. Câu \"Chỉ xem, đừng thực hiện\" để AI chỉ báo giá, không đổi thật.")} />
        <Read text={t("If you have a balance, you can try a real swap yourself. This lesson has no real-swap practice.", "Nếu có số dư, bạn có thể tự thử đổi thật. Bài học này không có phần thực hành đổi thật.")} />
      </S>
      <S text={t("Ask your AI:", "Hỏi AI:")}>
        <Code text={t("Do I have any open limit orders?", "Tôi đang có lệnh limit nào chưa khớp?")} />
        <Ok text={t("Your AI says there are no limit orders waiting.", "AI báo không có lệnh limit nào đang chờ.")} />
        <Read text={t("How to read it: a limit order waits until the price hits your level. A new wallet has no orders, so the list is empty.", "Cách đọc: lệnh limit nằm chờ đến khi giá chạm mức bạn đặt. Ví mới chưa đặt lệnh nào nên danh sách trống.")} />
      </S>
      <S text={t("**Save your learning progress (save 1).** This step records on the blockchain that you finished reading pages 1 to 4 of Course 2. Send your AI:", "**Lưu tiến độ học bài (ký lần 1).** Bước này ghi lên blockchain rằng bạn đã đọc xong trang 1 đến 4 của Khóa học 2. Gửi AI:")}>
        {save(0, t("Save my learning progress on Agent Academy: finished reading pages 1 to 4 of course 2.", "Lưu tiến độ học bài của tôi trên Agent Academy: đã đọc xong trang 1 đến 4 của khóa học 2."))}
        <Read text={t("This is the first save of Course 2. Developer Mode must be on; if it expired, turn it on again as in Course 1. Your AI shows you a preview. Check whether any token leaves your wallet. If it's right, type “confirm”. Saving progress only costs a little gas.", "Đây là lần ký đầu tiên của Khóa học 2. Developer Mode phải đang bật, nếu đã hết hạn thì bật lại như ở Khóa học 1. AI cho bạn xem trước. Xem có token nào bị chuyển đi không. Thấy đúng thì gõ \"xác nhận\". Lưu tiến độ chỉ tốn một chút gas.")} />
      </S>
    </Steps>
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
    <Steps>
      <S text={t("Ask your AI:", "Hỏi AI:")}>
        <Code text={t("What DeFi positions do I have?", "Vị thế DeFi của tôi hiện có gì?")} />
        <Ok text={t("Your AI says you have no DeFi positions yet, total value 0 USD.", "AI báo bạn chưa có vị thế DeFi nào, tổng giá trị 0 USD.")} />
      </S>
      <S text={t("Ask your AI:", "Hỏi AI:")}>
        <Code text={t("What DeFi tasks can this wallet do?", "Ví này làm được những việc DeFi nào?")} />
        <Ok text={t("Your AI splits them into 2 groups. Viewing: protocol list, protocol details, investment opportunities, your positions, transaction previews. Actions: deposit, withdraw, add liquidity, remove liquidity, claim rewards. Plus the DeFi daily limit of 5,000 USD.", "AI chia làm 2 nhóm. Nhóm xem thông tin: danh sách giao thức, chi tiết giao thức, các cơ hội đầu tư, vị thế của bạn, xem trước giao dịch. Nhóm thao tác: gửi vào, rút, thêm thanh khoản, rút thanh khoản, nhận thưởng. Kèm hạn mức DeFi mỗi ngày là 5.000 USD.")} />
      </S>
    </Steps>
    <Read text={t("If you have a balance, you can try it yourself. This lesson has no real DeFi practice.", "Nếu có số dư, bạn có thể tự thử. Bài học này không có phần thực hành DeFi thật.")} />
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
    <P text={t("This lesson only introduces these two features, no practice.", "Bài học này chỉ giới thiệu hai tính năng này, không thực hành.")} />
  </>;
}

function Page8({ save }: Pick<Ctx, "save">) {
  const t = useT();
  const n = useNames();
  return <>
    <H2 text={n[7]} />
    <Steps>
      <S text={t("Ask your AI:", "Hỏi AI:")}>
        <Code text={t("What are my Prediction and x402 limits?", "Hạn mức Dự đoán và x402 của tôi là bao nhiêu?")} />
        <Ok text={t("Your AI gives the daily limit of both: Prediction 5,000 USD, x402 20 USD, 0 used. Prediction is off, so it can't be used yet. These two limits are separate and don't count toward the general trading limit.", "AI báo hạn mức mỗi ngày của hai loại: Dự đoán 5.000 USD, x402 20 USD, đã dùng 0. Dự đoán đang tắt nên chưa dùng được. Hai hạn mức này tính riêng, không trừ vào hạn mức giao dịch chung.")} />
        <Read text={t("How to read it: “separate” means using up the Prediction or x402 limit leaves the 50,000 USD general trading limit untouched. Each kind of task has its own limit, as in Course 1.", "Cách đọc: \"tính riêng\" nghĩa là dùng hết hạn mức Dự đoán hay x402 thì hạn mức giao dịch chung 50.000 USD vẫn còn nguyên. Mỗi loại việc có một hạn mức riêng, như ở Khóa học 1.")} />
      </S>
      <S text={t("**Save your learning progress (save 2).** This step records on the blockchain that you finished reading pages 1 to 8 of Course 2. Send your AI:", "**Lưu tiến độ học bài (ký lần 2).** Bước này ghi lên blockchain rằng bạn đã đọc xong trang 1 đến 8 của Khóa học 2. Gửi AI:")}>
        {save(1, t("Save my learning progress on Agent Academy: finished reading pages 1 to 8 of course 2.", "Lưu tiến độ học bài của tôi trên Agent Academy: đã đọc xong trang 1 đến 8 của khóa học 2."))}
        <Read text={t("If Developer Mode hasn't expired, keep using it; no need to turn it on again. Your AI shows you a preview. Check whether any token leaves your wallet. If it's right, type “confirm”.", "Developer Mode còn hạn thì dùng tiếp, không cần bật lại. AI cho bạn xem trước. Xem có token nào bị chuyển đi không. Thấy đúng thì gõ \"xác nhận\".")} />
      </S>
    </Steps>
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
    <Steps>
      <S text={t("Ask your AI:", "Hỏi AI:")}>
        <Code text={t("Which contracts has my wallet given approvals to?", "Ví của tôi đã cấp quyền cho những hợp đồng nào?")} />
        <Ok text={t("Your AI says the wallet hasn't approved any token for any contract.", "AI báo ví không cấp quyền token nào cho hợp đồng nào.")} />
        <Read text={t("How to read it: a new wallet has no approvals. If it has some later, the AI can show each one and revoke it after you confirm.", "Cách đọc: ví mới chưa cấp quyền nào. Nếu sau này có, AI xem được chi tiết từng quyền và thu hồi sau khi bạn xác nhận.")} />
      </S>
      <S text={t("Ask your AI:", "Hỏi AI:")}>
        <Code text={t("Which of my transactions are pending or stuck?", "Giao dịch nào của tôi đang chờ hoặc bị kẹt?")} />
        <Ok text={t("Your AI says no transactions are pending or stuck. The wallet status is UNLOCKED.", "AI báo không có giao dịch nào đang chờ hoặc bị kẹt. Trạng thái ví là UNLOCKED.")} />
        <Read text={t("How to read it: UNLOCKED means the wallet is ready to send a new transaction.", "Cách đọc: UNLOCKED nghĩa là ví sẵn sàng gửi giao dịch mới.")} />
      </S>
    </Steps>
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
  return <>
    <H2 text={n[11]} />
    <Steps>
      <S text={t("Ask your AI:", "Hỏi AI:")}>
        <Code text={t("Run a safety check on my wallet.", "Kiểm tra an toàn ví của tôi.")} />
        <Ok text={t("Your AI checks connection, approvals, pending transactions, balances, limits and Developer Mode, then says it found nothing unusual.", "AI kiểm tra kết nối, quyền đã cấp, giao dịch đang chờ, số dư, hạn mức và Developer Mode, rồi báo không thấy gì bất thường.")} />
        <Read text={t("It only reports what it could check. It may suggest turning off Developer Mode or lowering high limits (change them in the Binance App).", "AI chỉ báo những gì kiểm tra được. Nó có thể khuyên tắt Developer Mode hoặc hạ hạn mức cao (đổi trong Binance App).")} />
      </S>
      <S text={t("**Save your progress (save 3).** Send your AI:", "**Lưu tiến độ (ký lần 3).** Gửi AI:")}>
        {save(2, t("Save my learning progress on Agent Academy: finished reading pages 1 to 12 of course 2.", "Lưu tiến độ học bài của tôi trên Agent Academy: đã đọc xong trang 1 đến 12 của khóa học 2."))}
        <Read text={t("Check that no token leaves your wallet, then type “confirm”. Your certificate opens.", "Xem không có token nào bị chuyển đi, rồi gõ \"xác nhận\". Chứng chỉ hiện ra.")} />
      </S>
      <S text={t("Done? Turn off Developer Mode in the Binance App if you won't use it.", "Xong rồi thì tắt Developer Mode trong Binance App nếu không dùng nữa.")} />
    </Steps>
    {status as ReactNode}
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
