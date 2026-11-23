# Agent Academy — Spec v1.2

## 0. Cách dùng
- Claude Code đọc toàn bộ spec này, thảo luận mục 14 với Hiếu, rồi mới build.
- KHÔNG bịa. Chỗ nào ghi [CHƯA KIỂM CHỨNG] thì phải kiểm tra hoặc hỏi Hiếu, không tự giả định.
- Mỗi quyết định sản phẩm: nêu một lần, đưa mặc định, rồi làm tiếp.

## 1. Sản phẩm
- Agent Academy là nhánh của repo 0xhieu, dùng để dạy cộng đồng về AI agent.
- Cấu trúc web chỉ có 2 loại trang:
  1. Trang chủ = "Thư viện": danh sách các cuốn sách.
  2. Trang sách: đọc từng trang theo thứ tự.
- Mỗi cuốn là một chủ đề; mỗi phần gồm lý thuyết + thực hành.
- Cuốn #1: Binance Agentic Wallet. Đây là cuốn đem đi dự thi.
- Cuốn #1 không giới hạn số ngày hay số trang. Chỉ cần đủ kiến thức căn bản và dễ hiểu để người học tự dùng được Binance Agentic Wallet.
- Tagline: "Learn Binance Agentic Wallet. Earn Certificates."
- Footer: "Independent community project. Not affiliated with, endorsed by, or operated by Binance."
- Tên domain, token, contract không chứa "binance" hoặc "bnb".

## 2. Sự thật đã kiểm chứng (không được đổi)
- Agent ID: contract `0x60b9262456de011f7d15a54cdd8c48baaa8b022f` trên BSC, ERC-721, không chuyển nhượng.
  - Kiểm tra người giữ: `balanceOf(addr) > 0`.
  - Không phải ERC721Enumerable (test RPC ngày 22/11/2026). Không suy ra tokenId từ địa chỉ được → tiến độ khoá theo địa chỉ.
- Agent ID gắn với ví Agentic Wallet. Nhận Agent ID chỉ làm được trong Binance App: Wallet > banner trang chủ > Agent ID.
- Agentic Wallet chỉ gọi contract tuỳ ý qua Developer Mode (`baw contract-call preview` rồi `execute`).
  - Bật Developer Mode chỉ làm được trong Binance App. Hiệu lực 7 ngày, mỗi lần dùng thành công thì gia hạn.
  - Lỗi `351802` = hết hạn; `351804` = tổng số dư vượt giới hạn; `351803` = preview bị chặn vì rủi ro cao.
  - `execute` có thể trả `PENDING_CONFIRMATION` (duyệt trong Binance App). `--value` tính bằng wei. Không truyền gas price.
- Tài liệu KHÔNG nhắc đến việc kết nối ví Agentic Wallet với dApp (WalletConnect/extension). Vì vậy web không gửi được giao dịch; việc ghi on-chain do agent của chính người học thực hiện.
- Cài đặt: `npx skills add binance/binance-skills-hub/skills/binance-web3/binance-agentic-wallet`. Cần Node 18+, tài khoản Binance, MPC Wallet. Đăng nhập: `auth signin` rồi `auth verify` bằng mã ghép cặp 6 ký tự xác nhận trong Binance App.
- Lệnh `baw` dùng cho bài học: `wallet status/address/balance/tx-history/gas-price/chains/settings/tx-lock/agent-id/resolve-domain`, `approvals list/detail`, `market-order quote`, `defi protocol-list`, `defi preview`.
- Nguồn lệnh chính thức: https://github.com/binance/binance-skills-hub/tree/main/skills/binance-web3/binance-agentic-wallet (SKILL.md và thư mục references/). Nội dung sách phải viết từ đây, không viết từ trí nhớ.

## 3. Red line của cuộc thi (vi phạm = loại)
- Web không đăng nhập bằng QR hay mã ghép cặp; không lưu phiên đăng nhập của người dùng.
- Mọi thao tác động đến tài sản: người dùng phải thấy và tự xác nhận. Prompt trong sách không được có câu bỏ qua bước xác nhận.
- Không chuyển tài sản trái phép, không gộp thêm chuyển khoản, không xin approve vô hạn.
- Contract mã nguồn mở, quyền của owner phải ghi rõ trong README.
- Không dùng "Binance"/"BNB" trong tên dự án, token, domain.
- Không thu seed phrase, private key, API secret, mã ghép cặp.
- Không hứa lợi nhuận; không dùng "thu nhập thụ động", "tự động kiếm tiền".
- Nội dung có giao dịch/giao dịch thử: hiển thị cảnh báo rủi ro trên trang.
- Không làm công cụ "tra ví người khác theo tên Agent ID". Web chỉ tra tiến độ theo ĐỊA CHỈ, không tra theo tên `.ai`.
- Không tạo giao dịch ảo/spam để tăng số liệu.

## 4. Cuốn #1 — cấu trúc
- Trang 1 (bắt buộc, trước mọi thứ): chuẩn bị.
  - Tạo tài khoản Binance và Agentic Wallet.
  - Nhận Agent ID trong Binance App (đường dẫn ở mục 2).
  - Cài skill, đăng nhập (`auth signin` / `auth verify`).
  - Nạp gas và bật Developer Mode. Số BNB cần nạp: [CHƯA KIỂM CHỨNG]. Gas có được tài trợ hay không: [CHƯA KIỂM CHỨNG]. Không viết con số khi chưa test.
  - Lưu ý Developer Mode hết hạn sau 7 ngày.
- Các trang sau: theo cặp lý thuyết rồi thực hành. Nội dung đề xuất lấy từ lệnh đã kiểm chứng:
  1. Ví và địa chỉ, số dư (`wallet status/address/balance`).
  2. Dữ liệu token, lịch sử giao dịch, gas (`tx-history`, `gas-price`, `chains`).
  3. Quyền và bảo mật (`approvals list/detail`, `tx-lock`, `settings`). Không dạy `revoke`.
  4. Giao dịch và DeFi chỉ xem trước (`market-order quote`, `defi protocol-list`, `defi preview`). Kèm cảnh báo rủi ro.
  5. Agent ID (`wallet agent-id`, `wallet resolve-domain`) và tổng kết.
- Thực hành chỉ đọc hoặc xem trước. Không bài nào yêu cầu giao dịch tiền thật.
- Mỗi trang thực hành có thể có nút "Ghi lên chuỗi" (xem mục 6).
- Số "chương cần ghi" (chapterCount) chốt SAU khi viết xong nội dung, vì contract bất biến (mục 14, quyết định 2).

## 5. Hợp đồng `AgentAcademy.sol`
- Solidity, Foundry, OpenZeppelin v5. Không proxy, không payable, không giữ tiền. Chỉ gọi Agent ID qua `balanceOf`.
- `IERC721 public immutable agentId = 0x60b9262456de011f7d15a54cdd8c48baaa8b022f`.
- Mọi hàm ghi yêu cầu `agentId.balanceOf(msg.sender) > 0`, nếu không revert `NoAgentId`.
- `createBook(bookId, chapterCount)`: chỉ owner, mỗi id một lần, chapterCount 1..256, bất biến sau khi tạo.
- `completeChapters(bookId, uint256 mask)`:
  - mask khác 0 và chỉ chứa bit < chapterCount.
  - Không còn khoá thời gian.
  - Revert `NothingNew` nếu không có bit mới.
  - Phát `ChapterCompleted(user, bookId, newBits, count)`.
  - Khi đủ chapterCount bit: đặt `certificateAt`, phát `CertificateIssued(user, bookId)`. Không có NFT mới.
- View: `progressOf(address, bookId) → (mask, count, certified)`, `hasCertificate(address, bookId)`, `books(bookId) → chapterCount`.
- Lỗi: `NoAgentId`, `BookNotFound`, `BookExists`, `InvalidChapterCount`, `InvalidMask`, `NothingNew`.
- Quyền owner (ghi trong README): chỉ `createBook`. Không mint, không pause, không rút tiền, không sửa tiến độ của người dùng.
- Sách thử nghiệm: bookId 900 (giao diện ẩn id >= 900).
- Test Foundry: không có Agent ID thì revert; mask hợp lệ/không hợp lệ; lặp lại mask cũ thì `NothingNew`; đủ bit thì cấp chứng chỉ; chỉ owner tạo sách; bookId trùng thì revert.

## 6. Luồng ghi on-chain (agent của người học thực hiện)
- Web tính sẵn calldata bằng viem rồi hiển thị prompt cho người học dán vào agent. Web không gửi giao dịch.
- Prompt mẫu:

Bạn đang có Binance Agentic Wallet skill (`baw`). Hãy ghi hoàn thành chương học của tôi lên hợp đồng Agent Academy trên BNB Smart Chain. Làm đúng từng bước và KHÔNG thay đổi bất kỳ giá trị nào bên dưới:
- binanceChainId: 56
- from: {{AGENT_WALLET}}
- to: {{ACADEMY_ADDRESS}}
- value: 0
- inputData: {{CALLDATA}}
- Giao dịch này gọi completeChapters(bookId={{BOOK_ID}}, mask={{MASK}}). Nó không chuyển token và không xin approve.
Bước 1: chạy `baw wallet settings --json`. Nếu devMode.enabled không phải true thì dừng lại và hướng dẫn tôi bật Developer Mode trong Binance App.
Bước 2: chạy `baw contract-call preview --binanceChainId 56 --from {{AGENT_WALLET}} --to {{ACADEMY_ADDRESS}} --value 0 --inputData {{CALLDATA}} --json`.
Bước 3: cho tôi xem parsedTx, risks và authorityChanges. Nếu preview báo lỗi hoặc rủi ro, dừng lại và báo nguyên văn lỗi.
Bước 4: CHỈ khi tôi trả lời "xác nhận", chạy `baw contract-call execute --requestId <requestId> --json`. Nếu cần xác nhận trong Binance App, nhắc tôi.
Bước 5: báo txHash cho tôi.

- Người học có thể ghi nhiều chương trong một lần (mask cộng dồn). Mask luôn là tiến độ tích luỹ.
- Web đọc tiến độ công khai bằng `progressOf` khi người học dán địa chỉ ví agent của mình. Không cần kết nối ví.
- Không yêu cầu API key, seed phrase, lịch sử chat hay quyền truy cập agent.

## 7. Giao diện
- Chỉ 2 loại trang: Thư viện (trang chủ) và Sách (đọc từng trang, có mục lục và nút trước/sau).
- Mỗi trang: Mục tiêu → Giải thích → Từng bước → Thực hành → (tuỳ chọn) Ghi lên chuỗi.
- Không có bước "kết nối ví", không có đăng nhập, không có backend lưu người dùng.
- Mặc định tiếng Việt.

## 8. Kỹ thuật
- Là nhánh trong repo 0xhieu. Claude Code đọc repo hiện có và theo stack, cấu trúc thư mục, cách deploy sẵn có; nếu chưa rõ thì hỏi Hiếu, không tự chọn.
- Không đụng vào công cụ khác trong repo.
- Phần Academy (web + contract) phải nằm trong repo công khai (mục 14, quyết định 1).
- Dùng viem để đọc contract và tạo calldata. Không dùng thư viện kết nối ví.

## 9. Thứ tự build
1. Đọc repo, đề xuất vị trí đặt Academy, hỏi Hiếu.
2. Contract + test Foundry.
3. Deploy BSC mainnet, verify trên BscScan, tạo sách thử nghiệm 900.
4. **Test Day-0 (chặn):** `balanceOf(<ví agent của Hiếu>)` phải bằng 1; agent của Hiếu chạy prompt ở mục 6 cho `completeChapters(900, 1)`. Nếu gặp `351803` hoặc vấn đề gas thì dừng và báo cáo, không tìm cách lách.
5. Web: Thư viện + khung trang sách.
6. Viết trang 1 và các trang sau từ tài liệu chính thức (mục 2).
7. Một người thứ hai có Agent ID thật chạy thử toàn bộ luồng.
8. Chốt nội dung → `createBook(1, chapterCount)` trên mainnet.
9. README (quyền owner, cách chạy, cách verify) rồi deploy.

## 10. Hạn chót
- Nộp bài đóng 2026-12-09 08:00 UTC.
- Giải Innovation cần sản phẩm đã live và ít nhất 30 địa chỉ giữ Agent ID tương tác với contract trong kỳ nộp.
- Chỉ tính địa chỉ giữ Agent ID. Địa chỉ không giữ sẽ bị revert `NoAgentId`.

## 11. Nộp bài
- Tên dự án, website, địa chỉ contract, mô tả cách dùng Agent ID, tài liệu khác theo yêu cầu.
- Mô tả Agent ID: chỉ người giữ Agent ID mới ghi được tiến độ và nhận chứng chỉ; trang 1 hướng dẫn nhận Agent ID. Không nói quá những gì contract không làm.

## 12. Chưa kiểm chứng (Day-0 sẽ trả lời)
- Risk engine của Developer Mode có chặn contract mới không.
- Địa chỉ giữ Agent ID có đúng bằng địa chỉ Agentic Wallet không.
- Gas có cần BNB trong ví không, và bao nhiêu.
- Có cách kết nối web nào khác không.
- Có tra ngược địa chỉ → tên `.ai` được không (nếu không, giao diện chỉ hiện địa chỉ).
- Tỉ lệ người học vượt qua Developer Mode + gas (chưa đo).

## 13. Thay đổi so với v1.1
- Bỏ lịch tuần/7 ngày, bỏ khoá bài theo giờ UTC, bỏ `createCourse` theo thời gian.
- Khoá học → Sách; `completeLessons` (uint8) → `completeChapters` (uint256).
- Trang chủ = Thư viện; chỉ còn 2 loại trang.
- Cài đặt, nạp gas, Developer Mode, nhận Agent ID chuyển vào trang 1 của sách.
- Repo: nhánh của 0xhieu (trước đó là repo riêng `binance-agent-academy`).

## 14. Quyết định (Hiếu trả lời 2026-11-23)
1. Repo công khai riêng: `KattyFury/0xhieu_agent-academy`, thư mục `C:\Users\hieu\Code\0xhieu_agent-academy`, lịch sử mới.
2. Số chương = số trang của cuốn sách, tuỳ nội dung (ví dụ cuốn Binance Agentic Wallet cần 16 trang thì chapterCount = 16). Mỗi trang là một chương.
3. Ngôn ngữ: English mặc định, Vietnamese là tuỳ chọn (ghi đè mục 7 "mặc định tiếng Việt").
4. Ghi on-chain: nút ghi ở mỗi trang, cho thấy người dùng đã đọc trang thay vì lướt qua rồi lấy chứng chỉ.
5. "Binance ID" = Agent ID của Agentic Wallet, ví dụ `0xhieu.ai`.
6. Giữ relayer gas miễn phí `/api/claim` (chỉ lưu địa chỉ đã nhận).
