from docx import Document
from docx.shared import Cm, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_CELL_VERTICAL_ALIGNMENT
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.enum.section import WD_SECTION
from docx.enum.style import WD_STYLE_TYPE
from docx.enum.text import WD_BREAK

OUT = r"D:\auction-hub\output\Bao_cao_du_an_AuctionHub.docx"

doc = Document()
sec = doc.sections[0]
sec.top_margin, sec.bottom_margin = Cm(2.2), Cm(2.0)
sec.left_margin, sec.right_margin = Cm(2.35), Cm(2.0)

styles = doc.styles
styles['Normal'].font.name = 'Arial'
styles['Normal']._element.rPr.rFonts.set(qn('w:eastAsia'), 'Arial')
styles['Normal'].font.size = Pt(10.5)
styles['Normal'].paragraph_format.space_after = Pt(6)
styles['Normal'].paragraph_format.line_spacing = 1.25
for name, size in [('Title', 24), ('Heading 1', 16), ('Heading 2', 13), ('Heading 3', 11)]:
    s = styles[name]
    s.font.name = 'Arial'; s._element.rPr.rFonts.set(qn('w:eastAsia'), 'Arial')
    s.font.size = Pt(size); s.font.bold = True; s.font.color.rgb = RGBColor(0, 0, 0)
    s.paragraph_format.space_before = Pt(14 if name != 'Title' else 0)
    s.paragraph_format.space_after = Pt(7)

caption = styles.add_style('CaptionCustom', WD_STYLE_TYPE.PARAGRAPH)
caption.font.name = 'Arial'; caption.font.size = Pt(9); caption.font.italic = True
caption.font.color.rgb = RGBColor(80, 80, 80); caption.paragraph_format.space_after = Pt(8)

def shade(cell, fill):
    tcPr = cell._tc.get_or_add_tcPr(); shd = OxmlElement('w:shd'); shd.set(qn('w:fill'), fill); tcPr.append(shd)

def borders(cell, color='BFBFBF'):
    tcPr = cell._tc.get_or_add_tcPr(); b = OxmlElement('w:tcBorders')
    for edge in ('top', 'left', 'bottom', 'right'):
        e = OxmlElement(f'w:{edge}'); e.set(qn('w:val'), 'single'); e.set(qn('w:sz'), '4'); e.set(qn('w:color'), color); b.append(e)
    tcPr.append(b)

def cell_text(cell, text, bold=False):
    p = cell.paragraphs[0]; p.paragraph_format.space_after = Pt(2); p.paragraph_format.space_before = Pt(2)
    r = p.add_run(str(text)); r.bold = bold; r.font.name = 'Arial'; r.font.size = Pt(9.5)
    cell.vertical_alignment = WD_CELL_VERTICAL_ALIGNMENT.CENTER

def table(headers, rows, widths=None):
    t = doc.add_table(rows=1, cols=len(headers)); t.alignment = WD_TABLE_ALIGNMENT.CENTER; t.style = 'Table Grid'
    for i, head in enumerate(headers):
        cell = t.rows[0].cells[i]; shade(cell, 'EDEAFB'); borders(cell); cell_text(cell, head, True)
    for row in rows:
        cells = t.add_row().cells
        for i, value in enumerate(row):
            borders(cells[i]); cell_text(cells[i], value)
    if widths:
        for row in t.rows:
            for i, width in enumerate(widths): row.cells[i].width = Cm(width)
    doc.add_paragraph().paragraph_format.space_after = Pt(2)
    return t

def heading(text, level=1):
    return doc.add_heading(text, level=level)

def para(text='', bold_prefix=None):
    p = doc.add_paragraph(); p.paragraph_format.space_after = Pt(6)
    if bold_prefix and text.startswith(bold_prefix):
        r = p.add_run(bold_prefix); r.bold = True; p.add_run(text[len(bold_prefix):])
    else: p.add_run(text)
    return p

def bullets(items):
    for item in items:
        p = doc.add_paragraph(style='List Bullet'); p.paragraph_format.space_after = Pt(2); p.add_run(item)

def page_break(): doc.add_page_break()

def page_number(paragraph):
    paragraph.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run = paragraph.add_run('Trang ')
    fld = OxmlElement('w:fldSimple'); fld.set(qn('w:instr'), 'PAGE')
    run._r.addnext(fld)

# Footer
footer = sec.footer.paragraphs[0]
footer.text = 'AuctionHub - Báo cáo dự án'
footer.alignment = WD_ALIGN_PARAGRAPH.LEFT
footer.runs[0].font.size = Pt(8); footer.runs[0].font.color.rgb = RGBColor(100, 100, 100)
footer.add_run('                                      ')
page_number(footer)

# Cover
for _ in range(4): doc.add_paragraph()
p = doc.add_paragraph(); p.alignment = WD_ALIGN_PARAGRAPH.CENTER
r = p.add_run('BÁO CÁO DỰ ÁN'); r.bold = True; r.font.name = 'Arial'; r.font.size = Pt(22)
p = doc.add_paragraph(); p.alignment = WD_ALIGN_PARAGRAPH.CENTER
r = p.add_run('AUCTIONHUB'); r.bold = True; r.font.name = 'Arial'; r.font.size = Pt(32); r.font.color.rgb = RGBColor(67, 56, 202)
p = doc.add_paragraph(); p.alignment = WD_ALIGN_PARAGRAPH.CENTER
r = p.add_run('Nền tảng đấu giá trực tuyến đa ngành'); r.font.size = Pt(16); r.font.italic = True
doc.add_paragraph()
table(['Thông tin', 'Nội dung'], [
    ['Loại sản phẩm', 'Website đấu giá C2C có luồng Buyer, Seller và Admin'],
    ['Phiên bản báo cáo', 'MVP frontend với dữ liệu mô phỏng cục bộ'],
    ['Công nghệ chính', 'React, TypeScript, Vite, React Router, Local Storage'],
    ['Phạm vi sản phẩm', 'Công nghệ, thời trang, mỹ phẩm và đồ tập gym'],
    ['Thời điểm lập báo cáo', 'Tháng 10 năm 2026'],
], [4.0, 12.5])
for _ in range(7): doc.add_paragraph()
p = doc.add_paragraph('Tài liệu mô tả định hướng kinh doanh, yêu cầu sản phẩm, thiết kế trải nghiệm và kế hoạch kỹ thuật của AuctionHub.'); p.alignment = WD_ALIGN_PARAGRAPH.CENTER
page_break()

# TOC
heading('MỤC LỤC', 1)
toc = [
'Tóm tắt điều hành', 'PHẦN 1. BUSINESS PLAN', '1.1 Tổng quan sản phẩm', '1.2 Mô hình kinh doanh và Lean Canvas', '1.3 Thị trường, khách hàng và cạnh tranh', '1.4 SWOT, lộ trình và chỉ số',
'PHẦN 2. PRODUCT REQUIREMENTS', '2.1 Vai trò và tính năng', '2.2 Yêu cầu chức năng cốt lõi', '2.3 Luồng nghiệp vụ chính', 'PHẦN 3. UX UI DESIGN', '3.1 Nguyên tắc thiết kế', '3.2 Hệ thống thiết kế', '3.3 Sơ đồ điều hướng', '3.4 Màn hình tiêu biểu',
'PHẦN 4. TECHNICAL PLAN', '4.1 Kiến trúc MVP', '4.2 Mô hình dữ liệu chính', '4.3 Bảo mật, kiểm thử và roadmap kỹ thuật', 'PHẦN 5. KẾT LUẬN']
for title in toc:
    p = doc.add_paragraph(style='List Bullet'); p.paragraph_format.space_after = Pt(2); p.add_run(title)
page_break()

heading('TÓM TẮT ĐIỀU HÀNH', 1)
para('AuctionHub là nguyên mẫu website đấu giá trực tuyến đa ngành, thiết kế cho giao dịch C2C tại Việt Nam. Hệ thống tập trung vào các phiên đấu giá có thời gian thực, giá hiện tại, lịch sử bid, hồ sơ người bán, danh sách theo dõi và các luồng đơn hàng sau khi đấu giá thành công.')
para('Phiên bản hiện tại là một frontend có thể kiểm thử độc lập: đăng ký và đăng nhập theo vai trò, phân quyền route, tạo phiên đấu giá, tìm kiếm và lọc, đặt giá, theo dõi sản phẩm, checkout giả lập, đồng bộ đơn Buyer - Seller, vận đơn mô phỏng, yêu cầu hoàn tiền và quản trị cơ bản. Dữ liệu được lưu bằng Local Storage để mô phỏng trạng thái liên tục trên trình duyệt.')
table(['Mục tiêu', 'Kết quả MVP'], [
['Tạo môi trường đấu giá minh bạch', 'Hiển thị giá hiện tại, bước giá tối thiểu, countdown và lịch sử bid.'],
['Bảo vệ giao dịch', 'Thiết kế luồng escrow mô phỏng: người mua thanh toán, người bán xử lý vận chuyển, Buyer theo dõi đơn.'],
['Tối ưu trải nghiệm', 'Card sản phẩm marketplace, lọc đơn lựa chọn, responsive và trạng thái trống/loading.'],
['Đa dạng danh mục', 'Thiết bị công nghệ, thời trang, mỹ phẩm và đồ tập gym với dữ liệu minh họa theo từng sản phẩm.'],
], [5.2, 11.3])
page_break()

heading('PHẦN 1. BUSINESS PLAN', 1)
heading('1.1 Tổng quan sản phẩm', 2)
para('Thị trường mua bán trực tuyến phổ biến nhưng vẫn thiếu một trải nghiệm đấu giá C2C gọn, có trạng thái giao dịch rõ ràng và hỗ trợ theo dõi từ lúc sản phẩm lên phiên đến khi đơn hàng hoàn tất. AuctionHub giải quyết nhu cầu đó bằng cách tổ chức phiên theo thời gian, chuẩn hóa thông tin sản phẩm và đưa các bước sau đấu giá vào cùng một hệ thống.')
bullets(['Đối tượng chính: người mua thích săn giá, người bán cá nhân hoặc cửa hàng nhỏ và quản trị viên nền tảng.', 'Giá trị cốt lõi: phiên đấu giá có thời hạn, thông tin sản phẩm dễ so sánh, trạng thái đơn minh bạch và phân quyền theo vai trò.', 'Phạm vi MVP: web frontend, dữ liệu mock và Local Storage; cổng thanh toán, vận chuyển và escrow ở dạng mô phỏng nghiệp vụ.'])
heading('1.2 Mô hình kinh doanh và Lean Canvas', 2)
table(['Khối Lean Canvas', 'Nội dung áp dụng cho AuctionHub'], [
['Vấn đề', 'Thiếu cơ chế đặt giá cạnh tranh và theo dõi giao dịch thống nhất; người mua khó kiểm chứng trạng thái sau khi thắng.'],
['Giải pháp', 'Phiên đấu giá realtime theo client, mức giá tối thiểu, watchlist, checkout, tracking đơn và dashboard seller.'],
['Giá trị khác biệt', 'Kết hợp đấu giá, trạng thái đơn và trải nghiệm marketplace trong một luồng; thiết kế sẵn cho cơ chế escrow.'],
['Khách hàng', 'Người mua nhạy giá; người bán muốn tối ưu giá chốt; cửa hàng nhỏ cần kênh thanh lý hoặc ra mắt hàng giới hạn.'],
['Kênh tiếp cận', 'SEO theo danh mục, cộng đồng mua bán, mạng xã hội, hợp tác người bán chuyên ngành và referral.'],
['Nguồn doanh thu', 'Phí nền tảng theo giao dịch, gói đẩy phiên, phí dịch vụ bảo vệ giao dịch và gói seller nâng cao.'],
['Chi phí', 'Hạ tầng, lưu trữ ảnh, thanh toán, vận chuyển, kiểm duyệt, chăm sóc khách hàng và marketing.'],
], [4.1, 12.4])
heading('1.3 Thị trường, khách hàng và cạnh tranh', 2)
para('AuctionHub khởi đầu với nhóm hàng có giá trị và tính khan hiếm tương đối như thiết bị công nghệ, giày và thời trang, mỹ phẩm nguyên seal, thiết bị tập luyện. Các danh mục này phù hợp với cơ chế bid vì người mua có động lực so sánh giá, còn người bán cần khám phá giá chốt thay vì niêm yết cố định.')
table(['Phân khúc', 'Nhu cầu', 'Giá trị nhận được'], [
['Buyer', 'Theo dõi phiên, đặt giá nhanh, biết rõ hạn thanh toán và trạng thái vận chuyển.', 'Giá cạnh tranh, thông tin có cấu trúc, lịch sử đơn và thông báo.'],
['Seller', 'Tạo phiên dễ, quản lý nhiều đơn và giảm trao đổi thủ công.', 'Dashboard phiên, tình trạng đơn, tracking và đánh giá.'],
['Admin', 'Kiểm duyệt nội dung, quản lý người dùng và phát hiện tranh chấp.', 'Dashboard tổng quan, trạng thái phiên và cơ sở để mở rộng kiểm duyệt.'],
], [3.0, 6.3, 7.2])
page_break()

heading('1.3.1 Đối thủ và lợi thế cạnh tranh', 3)
table(['Giải pháp thay thế', 'Hạn chế', 'Lợi thế định hướng của AuctionHub'], [
['Sàn niêm yết giá cố định', 'Không tạo được cơ chế khám phá giá cho hàng khan hiếm hoặc thanh lý.', 'Đấu giá có countdown, bước giá và lịch sử bid.'],
['Nhóm mạng xã hội', 'Giao dịch phân mảnh, thông tin sản phẩm và trạng thái đơn thiếu chuẩn hóa.', 'Card dữ liệu thống nhất, watchlist, profile và đơn hàng theo vai trò.'],
['Đấu giá truyền thống', 'Quy trình đăng ký, thanh toán và xác thực có thể tách rời.', 'Một luồng web từ phiên, checkout đến tracking đơn.'],
], [3.5, 5.1, 7.9])
heading('1.4 SWOT, lộ trình và chỉ số', 2)
table(['Điểm mạnh', 'Điểm yếu', 'Cơ hội', 'Thách thức'], [
['Frontend đã có workflow liên kết, UI rõ vai trò và dữ liệu đa danh mục.', 'MVP dùng Local Storage, chưa có backend và thanh toán thật.', 'Nhu cầu thanh lý, săn hàng giới hạn và shopping social tăng.', 'Gian lận, chất lượng hàng, hoàn tiền và tích hợp đối tác vận hành.'],
], [4.1, 4.1, 4.1, 4.1])
table(['Giai đoạn', 'Mục tiêu', 'Đầu ra'], [
['0 - 3 tháng', 'Hoàn thiện MVP và thử nghiệm usability.', 'Phân quyền, bid, checkout mock, đơn Buyer - Seller, admin cơ bản.'],
['3 - 6 tháng', 'Xây backend và dữ liệu thật.', 'API, PostgreSQL, lưu ảnh, đăng nhập an toàn, audit log.'],
['6 - 12 tháng', 'Kết nối đối tác giao dịch.', 'Thanh toán, escrow, vận chuyển, dispute và thông báo đa kênh.'],
], [3.0, 6.0, 5.5])
bullets(['Chỉ số cần theo dõi: tỷ lệ bid trên mỗi phiên, tỷ lệ thắng đến thanh toán, tỷ lệ giao thành công, thời gian xử lý tranh chấp, tỷ lệ quay lại và GMV.', 'Chỉ tiêu chất lượng: không có route vượt quyền, bid không thấp hơn giá tối thiểu, mọi đơn có lịch sử trạng thái và tracking khi giao hàng.'])
page_break()

heading('PHẦN 2. PRODUCT REQUIREMENTS', 1)
heading('2.1 Vai trò và tính năng', 2)
table(['Vai trò', 'Tính năng đã có trong MVP'], [
['Khách chưa đăng nhập', 'Trang chủ, tìm kiếm, lọc, xem chi tiết phiên và hồ sơ người bán.'],
['Buyer', 'Đăng ký/đăng nhập, đặt giá, yêu thích, hồ sơ, checkout, danh sách đơn, xem vận đơn và yêu cầu hoàn tiền mô phỏng.'],
['Seller', 'Đăng ký seller, tạo phiên, dashboard, danh sách phiên, danh sách đơn, cập nhật trạng thái giao hàng.'],
['Admin', 'Dashboard quản trị và route riêng theo vai trò.'],
], [3.4, 13.1])
heading('2.2 Yêu cầu chức năng cốt lõi', 2)
table(['Mã', 'Yêu cầu', 'Trạng thái MVP'], [
['FR-01', 'Tài khoản chọn role Buyer hoặc Seller, route bị chặn nếu role không phù hợp.', 'Hoàn thành'],
['FR-02', 'Tìm kiếm, lọc một lựa chọn theo thuộc tính và sắp xếp danh sách phiên.', 'Hoàn thành'],
['FR-03', 'Chi tiết phiên có ảnh, thông số, countdown, lịch sử bid và kiểm tra giá tối thiểu.', 'Hoàn thành'],
['FR-04', 'Nút yêu thích trên card lưu vào watchlist và phản ánh tại hồ sơ Buyer.', 'Hoàn thành'],
['FR-05', 'Checkout lấy địa chỉ, thanh toán mô phỏng và tạo/cập nhật đơn.', 'Hoàn thành'],
['FR-06', 'Seller cập nhật trạng thái đơn, tracking; Buyer xem tiến trình và hoàn tiền mô phỏng.', 'Hoàn thành ở mức mock'],
], [1.5, 11.0, 4.0])
heading('2.3 Luồng nghiệp vụ chính', 2)
para('Khám phá và đặt giá: Trang chủ hoặc Search -> chọn card sản phẩm -> xem chi tiết -> nhập bid lớn hơn giá hiện tại cộng bước giá -> cập nhật giá và lịch sử bid trong Local Storage.')
para('Theo dõi: Người dùng nhấn biểu tượng tim trên card Search hoặc Seller profile -> auction ID được ghi vào watchlist -> tab Theo dõi ở Buyer profile và trang Watchlist đọc cùng nguồn dữ liệu.')
para('Đơn hàng: Buyer thắng phiên -> Checkout nhập địa chỉ, chọn phương thức thanh toán -> đơn chuyển sang paid/pending payment -> Seller cập nhật shipping và tracking -> Buyer theo dõi đến delivered/completed hoặc gửi yêu cầu hoàn tiền.')
page_break()

heading('PHẦN 3. UX UI DESIGN', 1)
heading('3.1 Nguyên tắc thiết kế', 2)
bullets(['Tập trung vào giá và thời gian: giá hiện tại, trạng thái và countdown được đặt tại vùng dễ quét trên card và trang chi tiết.', 'Marketplace card: ảnh, tên, thuộc tính, giá, trạng thái và hành động được gom trong một thẻ thống nhất để so sánh nhanh.', 'Không gây quá tải lựa chọn: mỗi thuộc tính filter chỉ nhận một lựa chọn, trạng thái đã chọn hiển thị rõ.', 'Responsive-first: lưới card thu về hai cột trên mobile; icon có kích thước cố định và typography nhất quán.', 'Phản hồi tức thì: watchlist, bid, checkout và đổi trạng thái đơn phản ánh ngay trong Local Storage.'])
heading('3.2 Hệ thống thiết kế', 2)
table(['Thành phần', 'Quy ước'], [
['Màu sắc', 'Accent tím cho CTA và trạng thái tương tác; màu cảnh báo cho countdown gấp; nền trung tính để ưu tiên ảnh sản phẩm.'],
['Typography', 'Font sans-serif rõ ràng; giá và countdown dùng số tabular/mono khi cần so sánh.'],
['Card sản phẩm', 'Ảnh tỷ lệ cố định, tiêu đề tối đa hai dòng, chip thuộc tính, giá, badge trạng thái và tim yêu thích.'],
['Trạng thái', 'Loading, empty state, lỗi form, success notice, disabled và route guard được thể hiện rõ.'],
], [3.3, 13.2])
heading('3.3 Sơ đồ điều hướng', 2)
para('Public: Trang chủ -> Search -> Chi tiết auction -> Đăng nhập/Đăng ký khi cần tương tác. Buyer: Profile -> Đang đấu giá / Đã thắng / Theo dõi / Đánh giá -> Checkout -> Orders -> Chi tiết đơn. Seller: Dashboard -> Tạo phiên / Quản lý phiên / Đơn hàng. Admin: Dashboard quản trị.')
heading('3.4 Màn hình tiêu biểu', 2)
table(['Màn hình', 'Mục tiêu trải nghiệm'], [
['Trang chủ', 'Giới thiệu giá trị, hiển thị phiên nổi bật và CTA đi tới tìm kiếm.'],
['Search', 'Lọc, sắp xếp, card marketplace, yêu thích ngay trên card và trạng thái không có kết quả.'],
['Auction detail', 'Hình ảnh, mô tả, thuộc tính, countdown, giá, form bid và lịch sử đặt giá.'],
['Buyer profile', 'Tổng hợp phiên đang tham gia, đã thắng, watchlist động, đánh giá và chỉnh sửa hồ sơ.'],
['Seller profile', 'Card đa danh mục đang bán, dữ liệu đã bán, đánh giá và hành động theo dõi người bán.'],
['Orders', 'Địa chỉ, thanh toán, tracking, cập nhật trạng thái và hoàn tiền mô phỏng.'],
], [4.2, 12.3])
page_break()

heading('PHẦN 4. TECHNICAL PLAN', 1)
heading('4.1 Kiến trúc MVP', 2)
para('AuctionHub được triển khai dưới dạng Single Page Application. React chịu trách nhiệm hiển thị UI theo component; TypeScript kiểm soát kiểu dữ liệu; Vite phục vụ môi trường phát triển và build; React Router phân tách public, buyer, seller, checkout và admin. Hệ thống dùng CSS thuần với design tokens, grid và flex thay vì thư viện UI.')
table(['Lớp', 'Công nghệ', 'Trách nhiệm'], [
['Presentation', 'React 19, CSS thuần', 'Layout, card, form, responsive, trạng thái giao diện.'],
['Routing', 'React Router', 'Điều hướng và RouteGuard theo buyer, seller, admin.'],
['State / Data MVP', 'Custom localDB + Local Storage', 'Session, users, auctions, bids, watchlist, orders, notifications.'],
['Build & Quality', 'Vite, TypeScript, ESLint', 'Build production, strict type checking và lint.'],
], [3.5, 4.6, 8.4])
heading('4.2 Mô hình dữ liệu chính', 2)
table(['Thực thể', 'Các trường trọng tâm'], [
['AuctionRecord', 'id, title, brand, category, condition, images, currentPrice, minIncrement, startsAt, endsAt, seller, bids, status.'],
['OrderRecord', 'id, auctionId, buyerId, sellerId, amount, fees, status, paymentMethod, shippingAddress, trackingCode.'],
['LocalUser', 'id, email, password mô phỏng, name, role, phone, city, businessType.'],
['Watchlist', 'Danh sách auction ID, được dùng chung giữa card và Buyer profile.'],
['NotificationRecord', 'userId, title, message, href, read, createdAt.'],
], [3.4, 13.1])
heading('4.3 Những giới hạn có chủ đích của MVP', 2)
bullets(['Dữ liệu và session nằm trên trình duyệt; Local Storage chỉ phù hợp demo, không phải cơ chế bảo mật cho môi trường production.', 'Escrow, thanh toán, vận chuyển và hoàn tiền chỉ mô phỏng trạng thái nghiệp vụ; chưa gọi API nhà cung cấp.', 'Countdown cập nhật trên client; production cần đồng bộ với thời gian server và cơ chế kết thúc phiên đáng tin cậy.', 'Ảnh mock dùng URL minh họa; production cần upload, kiểm duyệt, nén ảnh và CDN.'])
page_break()

heading('4.4 Bảo mật và quyền riêng tư', 2)
table(['Rủi ro', 'Yêu cầu khi production hóa'], [
['Xác thực', 'Hash mật khẩu ở backend, refresh token an toàn, giới hạn thử đăng nhập và xác minh email/điện thoại.'],
['Phân quyền', 'Kiểm tra role tại API, không chỉ chặn bằng UI/route phía client.'],
['Bid và kết thúc phiên', 'Transaction ACID, khóa cạnh tranh hoặc optimistic locking, thời gian server và audit log.'],
['Thanh toán / escrow', 'Tích hợp đối tác được cấp phép, webhook ký số, đối soát và trạng thái bất biến.'],
['Dữ liệu cá nhân', 'Mã hóa khi truyền/lưu, tối thiểu hóa dữ liệu, chính sách retention và quy trình xóa dữ liệu.'],
], [4.1, 12.4])
heading('4.5 Kế hoạch kiểm thử', 2)
table(['Nhóm test', 'Ca kiểm thử đại diện'], [
['Phân quyền', 'Khách truy cập URL Buyer/Seller/Admin; hệ thống chuyển đúng tới login hoặc dashboard phù hợp.'],
['Auction', 'Bid dưới bước giá bị từ chối; bid hợp lệ cập nhật giá và lịch sử.'],
['Watchlist', 'Nhấn tim ở Search hoặc Seller profile; Buyer profile phản ánh số lượng và có thể bỏ theo dõi.'],
['Order', 'Checkout thiếu địa chỉ báo lỗi; seller đổi shipping; buyer nhìn thấy tracking và trạng thái tương ứng.'],
['UI responsive', 'Card, filter, icon, font và tab không vỡ ở desktop/mobile.'],
], [3.5, 13.0])
heading('4.6 Roadmap kỹ thuật', 2)
table(['Ưu tiên', 'Hạng mục'], [
['P0', 'Backend API, PostgreSQL, auth an toàn, server time, upload ảnh và migration từ Local Storage.'],
['P1', 'Cổng thanh toán, escrow qua đối tác, vận chuyển, webhook, notification email/push.'],
['P2', 'Tìm kiếm full-text, đề xuất phiên, moderation, analytics seller và hệ thống dispute.'],
['P3', 'Mobile app, dashboard BI, chống gian lận và cá nhân hóa nâng cao.'],
], [3.0, 13.5])
page_break()

heading('PHẦN 5. KẾT LUẬN', 1)
heading('5.1 Tổng kết thành quả', 2)
para('AuctionHub đã hình thành một MVP frontend có đầy đủ trục nghiệp vụ chính của sàn đấu giá: khám phá phiên, đặt giá, phân quyền, quản lý hồ sơ, tạo phiên seller, checkout, quản lý đơn và quản trị cơ bản. Việc dùng một localDB tập trung giúp các luồng mô phỏng liên kết được với nhau và có thể kiểm thử nhanh trong trình duyệt.')
para('Sản phẩm cũng mở rộng danh mục từ thiết bị công nghệ sang thời trang, mỹ phẩm và đồ tập gym. Điều này chứng minh UI card, filter, watchlist và mô hình dữ liệu không bị phụ thuộc vào một loại hàng duy nhất. Các ảnh minh họa, thông số và đơn hàng mock được liên kết theo auction ID để giữ trải nghiệm nhất quán.')
heading('5.2 Định hướng tiếp theo', 2)
bullets(['Thử nghiệm usability với buyer và seller thật để đo mức dễ hiểu của giá, countdown, checkout và trạng thái giao hàng.', 'Thay Local Storage bằng API có xác thực và database giao dịch để đảm bảo bid, đơn và lịch sử thay đổi có tính tin cậy.', 'Tích hợp vận chuyển, thanh toán/escrow và quy trình dispute trước khi mở giao dịch có giá trị thật.', 'Xây quy tắc kiểm duyệt danh mục, ảnh và mô tả; bổ sung cơ chế đánh giá và chống gian lận.'])
para('Với nền tảng workflow đã hoàn thiện ở cấp độ MVP, AuctionHub có thể chuyển sang giai đoạn validation và production hóa theo từng phần, ưu tiên tính an toàn giao dịch và độ tin cậy vận hành trước khi mở rộng quy mô người dùng.')

doc.save(OUT)
print(OUT)
