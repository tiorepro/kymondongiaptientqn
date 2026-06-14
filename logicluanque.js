// LogicLuanQue.js
// BẢNG LUẬN QUẺ - LOGIC 26 CHỦ ĐỀ CHUYÊN SÂU (PHIÊN BẢN NÂNG CẤP TOÀN DIỆN)
// Giữ nguyên 100% hướng dẫn gốc + Tích hợp thuật toán luận giải chuyên gia Kỳ Môn

(function () {
  'use strict';

  let activeEngine = null;
  if (typeof window.KyMonEngine !== 'undefined') {
    activeEngine = window.KyMonEngine;
  } else if (typeof window.HaDoBanKyMon !== 'undefined') {
    activeEngine = window.HaDoBanKyMon;
  }

  if (!activeEngine) {
    console.error('Không tìm thấy Engine Kỳ Môn. Bảng luận quẻ vô hiệu hóa.');
    return;
  }

  const _U = activeEngine.utils || {};

  const MAP_CAN = _U.NGU_HANH_CAN || {
    'Giáp':'Mộc','Ất':'Mộc','Bính':'Hỏa','Đinh':'Hỏa',
    'Mậu':'Thổ','Kỷ':'Thổ','Canh':'Kim','Tân':'Kim',
    'Nhâm':'Thủy','Quý':'Thủy'
  };
  const MAP_SAO = _U.NGU_HANH_SAO || {
    'Thiên Bồng':'Thủy','Thiên Nhuế':'Thổ','Thiên Xung':'Mộc',
    'Thiên Phụ':'Thổ','Thiên Cầm':'Thổ','Thiên Tâm':'Kim',
    'Thiên Trụ':'Kim','Thiên Nhậm':'Thủy','Thiên Anh':'Hỏa'
  };
  const FALLBACK_META = {
    1:{ten:'Khảm',huong:'Bắc',hanh:'Thủy'},
    2:{ten:'Khôn',huong:'Đông Nam',hanh:'Thổ'},
    3:{ten:'Chấn',huong:'Đông',hanh:'Mộc'},
    4:{ten:'Tốn',huong:'Tây Nam',hanh:'Kim'},
    5:{ten:'Trung',huong:'Trung tâm',hanh:'Thổ'},
    6:{ten:'Kiền',huong:'Tây Bắc',hanh:'Kim'},
    7:{ten:'Ly',huong:'Nam',hanh:'Hỏa'},
    8:{ten:'Cấn',huong:'Đông Bắc',hanh:'Mộc'},
    9:{ten:'Đoài',huong:'Tây',hanh:'Kim'}
  };

  // ============================ HƯỚNG DẪN TỪNG CHỦ ĐỀ (BẢO TOÀN 100%) ============================
  const TOPIC_GUIDES = {
    1: {
      title: '1. Cơ thể',
      vars: [
        ['Giáp (thiên bàn)', 'Đầu, gan, túi mật'],
        ['Ất (thiên bàn)', 'Gan, túi mật, thực quản, cổ họng, hệ thần kinh'],
        ['Bính (thiên bàn)', 'Ruột non, môi, vai, trán'],
        ['Đinh (thiên bàn)', 'Răng, tim, mắt, trào ngược, bốc hỏa'],
        ['Mậu (thiên bàn)', 'Cơ bụng, bao tử, mũi'],
        ['Kỷ (thiên bàn)', 'Mắt, tỳ, tạng, miệng, bụng'],
        ['Canh (thiên bàn)', 'Xương, sườn, ruột già'],
        ['Tân (thiên bàn)', 'Bụng, phổi, phế quản, ngực, cổ'],
        ['Nhâm (thiên bàn)', 'Tim mạch, bàng quang, máu, hệ thực vật'],
        ['Quý (thiên bàn)', 'Thần kinh, chân, thận'],
      ],
      signals: [],
      how: 'Xem can nào đại diện bệnh/bị thương → quy chiếu sang bộ phận. Nếu bị khắc, không vong, nhập mộ → bộ phận đó yếu hoặc có vấn đề.'
    },
    2: {
      title: '2. Nghề nghiệp',
      vars: [
        ['Can năm', 'Quản lý'],
        ['Can tháng', 'Đồng nghiệp'],
        ['Can ngày', 'Người hỏi'],
        ['Can giờ', 'Nhân viên cấp dưới'],
        ['Trực Phù', 'Sếp lớn'],
        ['Thái Tuế', 'Sếp siêu lớn'],
        ['Khai Môn', 'Sự nghiệp'],
        ['Sinh Môn', 'Lợi nhuận, tiền'],
        ['Đỗ Môn', 'Công việc sắp tới'],
      ],
      signals: [
        ['Khai Môn phản ngâm', 'Công việc có sự thay đổi lớn'],
        ['Khai Môn không vong', 'Chấm dứt công việc'],
        ['Khai Môn nhập mộ', 'Sai phạm'],
        ['Can ngày khắc Thái Tuế', 'Không hợp sếp'],
        ['Thiên Phụ tinh', 'Môi trường làm việc dễ chịu'],
        ['Thi Nhậm tinh', 'Được hỗ trợ bởi cấp dưới và cấp trên'],
        ['Thiên Tâm tinh', 'Sếp giỏi'],
        ['Thiên Xung tinh', 'Áp lực công việc lớn'],
        ['Thiên Bồng tinh', 'Bị sếp chèn ép'],
      ],
      how: 'Lấy can ngày làm mình. Xem Khai Môn (nghề nghiệp), Sinh Môn (tiền). Xem quan hệ mình với Thái Tuế / Trực Phù / Can năm để biết hợp cấp trên hay không. Xem sao đi kèm để luận môi trường và áp lực.'
    },
    3: {
      title: '3. Thăng chức',
      vars: [
        ['Khai Môn', 'Quyết định thăng chức'],
        ['Can ngày', 'Người hỏi'],
        ['Đỗ Môn', 'Người đang đề bạt/push hồ sơ'],
        ['Trực Phù', 'Sếp lớn'],
        ['Thái Tuế', 'Sếp siêu lớn'],
        ['Can năm', 'Quản lý cấp cao'],
      ],
      signals: [],
      how: 'Trọng tâm là Khai Môn (có quyết định nâng chức không). Đỗ Môn cho biết người đang push hồ sơ. Trực Phù, Thái Tuế, Can năm cho biết hệ cấp trên có ủng hộ không.'
    },
    4: {
      title: '4. Tìm kiếm người dẫn đường',
      vars: [['Thiên Phụ tinh', 'Vị trí / phương hướng của người dẫn đường']],
      signals: [],
      how: 'Xác định Thiên Phụ tinh đang ở cung nào, phương nào, trạng thái thế nào để suy vị trí hoặc hướng của người dẫn đường.'
    },
    5: {
      title: '5. Chuyển việc',
      vars: [
        ['Khai Môn', 'Sự nghiệp sau khi xin nghỉ'],
        ['Can ngày', 'Người hỏi / công việc hiện tại'],
        ['Đỗ Môn', 'Công ty đang xin việc mới'],
      ],
      signals: [],
      how: 'So sánh can ngày với Đỗ Môn để biết có hợp công ty mới không. Xem Khai Môn để biết tương lai nghề nghiệp sau khi rời công việc hiện tại.'
    },
    6: {
      title: '6. Xin việc',
      vars: [
        ['Khai Môn', 'Quyết định (đậu/rớt)'],
        ['Can ngày', 'Người hỏi'],
        ['Đỗ Môn', 'Phỏng vấn / buổi thử việc'],
      ],
      signals: [],
      how: 'Đỗ Môn cho biết tình hình phỏng vấn. Khai Môn quyết định đậu hay không. Quan hệ giữa can ngày và Đỗ Môn / Khai Môn cho biết mức phù hợp.'
    },
    7: {
      title: '7. Mua hàng',
      vars: [
        ['Can ngày', 'Người mua'],
        ['Can giờ', 'Sản phẩm / dịch vụ'],
        ['Cảnh Môn', 'Thị trường'],
      ],
      signals: [
        ['Can giờ vượng + cách cục tốt', 'Sản phẩm tốt, phù hợp thị trường'],
        ['Can giờ suy + cách cục tốt', 'Sản phẩm chưa tốt nhất nhưng thị trường vẫn đón nhận ban đầu'],
        ['Can giờ sinh can ngày', 'Người mua muốn mua sản phẩm'],
        ['Can giờ khắc can ngày', 'Sản phẩm không phù hợp người mua'],
        ['Can giờ không vong', 'Sản phẩm không phù hợp người mua'],
        ['Can ngày sinh can giờ', 'Người mua yêu thích sản phẩm'],
        ['Can ngày khắc can giờ', 'Phải thay đổi sản phẩm, thị trường nhanh bão hòa'],
      ],
      how: 'Dùng can ngày làm bên mua, can giờ làm món hàng. Xem sinh-khắc để biết có nhu cầu thực không. Xem Cảnh Môn để biết thị trường có ủng hộ không.'
    },
    8: {
      title: '8. Bán hàng',
      vars: [
        ['Can ngày', 'Người bán'],
        ['Trực Sử', 'Người mua / khách hàng'],
        ['Can giờ', 'Sản phẩm / dịch vụ'],
        ['Mậu', 'Vốn'],
        ['Sinh Môn', 'Tiền lời / lợi nhuận'],
      ],
      signals: [
        ['Can giờ sinh Sinh Môn', 'Có lợi nhuận'],
        ['Can giờ khắc Sinh Môn / Mậu', 'Không có lợi nhuận'],
        ['Can ngày sinh Trực Sử', 'Phụ thuộc khách hàng'],
        ['Can ngày khắc Trực Sử', 'Gặp nhiều vấn đề với khách hàng'],
        ['Can giờ khắc can ngày', 'Người bán không nắm bắt xu thế sản phẩm'],
      ],
      how: 'Xem 4 yếu tố: người bán – khách – sản phẩm – lợi nhuận. Nếu can giờ tốt và sinh Sinh Môn → bán ra tiền. Nếu can giờ khắc Sinh Môn/Mậu → lợi nhuận kém.'
    },
    9: {
      title: '9. Mở kinh doanh',
      vars: [['Khai Môn', 'Dụng thần chính']],
      signals: [
        ['Trực Phù đi cùng Khai Môn', 'Nhận được nhiều hỗ trợ, thuận lợi'],
        ['Thái Âm đi cùng', 'Khách hàng yêu thích và quay lại'],
        ['Lục Hợp đi cùng', 'Sẽ có kêu gọi hợp tác'],
        ['Cửu Thiên đi cùng', 'Bán tốt, có danh tiếng'],
        ['Đằng Xà đi cùng', 'Dễ gặp vấn đề pháp lý'],
        ['Bạch Hổ / Câu Trần', 'Bế tắc, mệt mỏi'],
        ['Huyền Vũ / Chu Tước', 'Thất thoát, cãi vã'],
        ['Cửu Địa đi cùng', 'Phát triển chậm'],
        ['Không vong / nhập mộ', 'Không nên khởi sự'],
      ],
      how: 'Lấy Khai Môn làm trọng tâm. Xem môn này đi cùng thần/tinh nào để biết cát hung khi khởi sự.'
    },
    10: {
      title: '10. Hợp tác',
      vars: [
        ['Can ngày', 'Người hỏi'],
        ['Can giờ', 'Người hợp tác'],
        ['Lục Hợp', 'Mối quan hệ hợp tác / người môi giới'],
        ['Sinh Môn', 'Lợi ích tài chính'],
      ],
      signals: [],
      how: 'So can ngày với can giờ để biết hợp hay khắc. Lục Hợp cho biết cầu nối, tính gắn kết. Sinh Môn cho biết lợi ích tài chính.'
    },
    11: {
      title: '11. Mua bán BĐS',
      vars: [
        ['Can ngày', 'Người hỏi'],
        ['Sinh Môn', 'Nhà'],
        ['Tử Môn', 'Đất'],
        ['Cửu Địa', 'Dự án lớn'],
        ['Cửu Thiên', 'Chung cư'],
        ['Cảnh Môn', 'Giấy tờ / pháp lý'],
        ['Mậu', 'Vốn'],
        ['Thiên Tâm', 'Tình hình tài chính'],
        ['Lục Hợp', 'Môi giới / trung gian'],
      ],
      signals: [],
      how: 'Mua nhà → chú ý Sinh Môn. Mua đất → chú ý Tử Môn. Cảnh Môn quyết định giấy tờ. Mậu và Thiên Tâm cho thấy vốn và khả năng tài chính. Lục Hợp biểu thị môi giới.'
    },
    12: {
      title: '12. Đi vay, cho vay',
      vars: [
        ['Can ngày', 'Người hỏi'],
        ['Trực Phù', 'Người cho vay'],
        ['Trực Sử', 'Người đi vay'],
      ],
      signals: [],
      how: 'Tùy người hỏi đang ở vai nào (bên vay hay bên cho vay), lấy can ngày đối chiếu với Trực Phù và Trực Sử để xem thế mạnh, khả năng được vay hoặc đòi vốn.'
    },
    13: {
      title: '13. Đòi nợ',
      vars: [
        ['Can ngày', 'Người hỏi (chủ nợ)'],
        ['Thương Môn', 'Việc đòi nợ'],
        ['Thái Ất', 'Người vay (con nợ)'],
        ['Sinh Môn', 'Khoản tiền'],
      ],
      signals: [],
      how: 'Xem Thương Môn để biết việc đòi nợ có tiến triển không. Thái Ất là bên đang nợ. Sinh Môn là khoản tiền – mạnh, sinh trợ thì dễ thu.'
    },
    14: {
      title: '14. Thi đấu',
      vars: [
        ['Can ngày', 'Đội muốn hỏi'],
        ['Can giờ (địa bàn)', 'Chủ nhà'],
        ['Can giờ (thiên bàn)', 'Đội khách'],
        ['Trực Phù', 'Trọng tài'],
      ],
      signals: [],
      how: 'So can ngày với can giờ để biết bên nào mạnh hơn. Dùng địa bàn/thiên bàn để tách chủ nhà – đội khách. Trực Phù cho biết yếu tố trọng tài, điều hành trận.'
    },
    15: {
      title: '15. Thi cử',
      vars: [
        ['Can ngày', 'Người hỏi'],
        ['Can năm cá nhân', 'Người thi'],
        ['Cảnh Môn', 'Đề thi / điểm số'],
        ['Thiên Phụ', 'Giáo viên / phòng thi'],
        ['Trực Phù', 'Người giám sát'],
        ['Can năm', 'Trường thi'],
      ],
      signals: [],
      how: 'Cảnh Môn là trọng tâm nếu xem kết quả thi. Can năm cá nhân là thí sinh. So tương quan với Cảnh Môn để biết mức thuận lợi về điểm số.'
    },
    16: {
      title: '16. Chỗ đỗ xe',
      vars: [['Không vong', 'Vị trí còn chỗ trống']],
      signals: [],
      how: 'Tìm cung hoặc phương có Không vong để luận chỗ trống còn đỗ được. Đi theo phương đó sẽ tìm được chỗ.'
    },
    17: {
      title: '17. Du lịch',
      vars: [
        ['Can ngày', 'Người hỏi'],
        ['Can giờ', 'Kết quả chuyến đi'],
        ['Cảnh Môn', 'Đường bộ'],
        ['Thương Môn', 'Phương tiện di chuyển'],
        ['Hưu Môn', 'Đường thủy'],
        ['Cửu Thiên / Khai Môn', 'Hàng không / máy bay'],
        ['Thiên Bồng', 'Trở ngại, trục trặc'],
      ],
      signals: [],
      how: 'Can giờ và phương hướng cho biết chuyến đi có thuận không. Xem môn để luận loại hình di chuyển. Thiên Bồng báo trở ngại, trục trặc.'
    },
    18: {
      title: '18. Hôn nhân',
      vars: [
        ['Ất', 'Vợ (nữ)'],
        ['Canh', 'Chồng (nam)'],
        ['Lục Hợp', 'Hôn nhân (trọng tâm)'],
        ['Đinh', 'Người thứ 3 là nữ'],
        ['Bính', 'Người thứ 3 là nam'],
        ['Huyền Vũ', 'Lừa dối'],
        ['Đằng Xà / Chu Tước', 'Thiếu tin tưởng'],
        ['Câu Trần / Bạch Hổ', 'Mất mát, tai nạn'],
        ['Cửu Thiên', 'Nhanh chóng, bất ngờ'],
      ],
      signals: [],
      how: 'Dùng Ất và Canh để định hai bên vợ chồng. Lục Hợp là trọng tâm hôn nhân. Nếu Bính/Đinh nổi bật → xét khả năng người thứ ba. Huyền Vũ, Đằng Xà, Chu Tước báo tín hiệu bất ổn niềm tin.'
    },
    19: {
      title: '19. Sinh nở (giới tính)',
      vars: [
        ['Cung Khôn', 'Mẹ'],
        ['Cửu tinh trong cung Khôn', 'Em bé'],
        ['Bát Môn dương', 'Giới tính nam'],
        ['Bát Môn âm', 'Giới tính nữ'],
      ],
      signals: [],
      how: 'Xác định cung Khôn (cung 2) là mẹ. Lấy cửu tinh trong cung Khôn làm em bé. Xem bát môn thuộc âm hay dương để luận giới tính.'
    },
    20: {
      title: '20. Sinh nở',
      vars: [
        ['Cung Khôn (cung 2)', 'Cung sinh / mẹ'],
        ['Thiên Nhuế', 'Mẹ'],
        ['Cửu tinh cung Khôn', 'Em bé'],
        ['Bạch Hổ cung Khôn', 'Sinh nhanh'],
        ['Phục ngâm', 'Sinh lâu, kéo dài'],
        ['Cung Khôn khắc bát môn', 'Nguy hiểm / cần phẫu thuật'],
      ],
      signals: [
        ['Thiên Nhuế khắc sao cung Khôn', 'Tốt, an toàn'],
        ['Sao cung Khôn sinh Thiên Nhuế', 'Sinh lâu'],
        ['Sao cung Khôn khắc Thiên Nhuế', 'Nguy hiểm'],
        ['Cung Thiên Nhuế khắc cung Khôn', 'Tốt'],
        ['Cung Khôn môn bách', 'Mẹ có nhiều bệnh, biến chứng'],
      ],
      how: 'Xem quan hệ giữa mẹ (Thiên Nhuế) và em bé (cửu tinh cung Khôn). Nếu khắc theo chiều tốt → sinh an toàn. Ngược lại → dễ nguy hiểm. Bạch Hổ cung Khôn: nhanh. Phục ngâm: kéo dài.'
    },
    21: {
      title: '21. Sức khỏe',
      vars: [
        ['Can ngày', 'Người hỏi / người bệnh'],
        ['Thiên Nhuế', 'Tình hình tiến triển của bệnh'],
        ['Thiên Xung', 'Cơ sở y tế'],
        ['Can giờ', 'Nguyên do bệnh'],
        ['Trực Phù', 'Loại bệnh'],
        ['Trực Sử', 'Thời gian phục hồi'],
        ['Ất', 'Thuốc đông y'],
        ['Thiên Tâm tinh', 'Tây y'],
        ['Đinh + Khai Môn', 'Đã trải qua phẫu thuật'],
        ['Mậu / Kỷ', 'Có vết sẹo, u bướu'],
        ['Bính', 'Viêm'],
        ['Nhâm / Quý', 'Máu huyết'],
      ],
      signals: [
        ['Người bệnh cùng cung Sinh Môn', 'Phục hồi nhanh'],
        ['Người bệnh cùng cung Tử Môn', 'Bệnh khó chữa, kéo dài'],
        ['Thiên Nhuế khắc người bệnh', 'Sức khỏe xấu, trở nặng'],
        ['Thiên Nhuế không vong (bệnh mới)', 'Tốt'],
        ['Người bệnh không vong', 'Bệnh khó chữa, kéo dài'],
      ],
      how: 'Xem Thiên Nhuế để biết bệnh đang tiến triển ra sao. Trực Sử cho biết tốc độ hồi phục. Sinh Môn/Tử Môn phân biệt bệnh dễ hồi hay kéo dài. Kết hợp bảng Cơ thể để xác định bộ phận liên quan.'
    },
    22: {
      title: '22. Kiện tụng',
      vars: [
        ['Can ngày', 'Người hỏi'],
        ['Trực Phù', 'Người thưa kiện'],
        ['Thiên Ất', 'Người bị kiện'],
        ['Khai Môn', 'Quan tòa'],
        ['Lục Hợp', 'Nhân chứng / bằng chứng'],
        ['Đỗ Môn', 'Viện kiểm sát'],
        ['Đinh', 'Giấy tờ, lệnh triệu tập'],
        ['Bính', 'Bằng chứng hình ảnh/video'],
        ['Kinh Môn', 'Luật sư'],
        ['Cảnh Môn', 'Đơn khởi kiện'],
      ],
      signals: [
        ['Khai Môn nhập mộ', 'Phiên tòa bị hoãn'],
        ['Khai Môn không vong', 'Còn kiện tiếp vì thiếu dữ liệu'],
        ['Khai Môn khắc Cảnh Môn', 'Tòa không thụ lý đơn'],
        ['Cảnh Môn không vong + Đằng Xà / Huyền Vũ', 'Việc không đúng sự thật'],
        ['Lục Hợp không vong', 'Chưa đủ bằng chứng'],
        ['Khai Môn phục ngâm', 'Vụ kiện kéo dài'],
        ['Khai Môn phản ngâm', 'Dời tòa / thay đổi phiên xét xử'],
      ],
      how: 'Khai Môn là then chốt (tượng tòa/quan xét xử). Cảnh Môn là đơn kiện – bị khắc thì khó thụ lý. Lục Hợp là chứng cứ – không vong thì hồ sơ yếu.'
    },
    23: {
      title: '23. Tố tụng hình sự',
      vars: [['Tân', 'Tội phạm (chủ điểm)']],
      signals: [
        ['Tân gặp Nhâm Quý', 'Đi tù'],
        ['Tân gặp kích hình', 'Tội nặng'],
        ['Tân gặp Bạch Hổ / Đỗ Môn', 'Bị giam cầm'],
        ['Tân gặp Đằng Xà', 'Lừa bịp'],
        ['Tân gặp Huyền Vũ', 'Trộm cắp'],
        ['Tân gặp Thương Môn + kích hình', 'Đánh nhau'],
        ['Tân gặp Mậu', 'Vì tiền mà mang họa'],
        ['Tân gặp Lục Hợp / can tháng', 'Dễ có đồng bọn'],
        ['Tân gặp Phục ngâm', 'Bắt giữ kéo dài'],
        ['Tân gặp Phản ngâm / Không vong', 'Dễ được phóng thích'],
      ],
      how: 'Chủ điểm là Tân. Xem Tân gặp gì để luận loại hành vi, mức độ nặng nhẹ và kết quả pháp lý.'
    },
    24: {
      title: '24. Đi lạc',
      vars: [
        ['Can ngày', 'Dụng thần (xác định qua quan hệ người thân)'],
        ['Lục Hợp', 'Hướng bắt đầu của người đi lạc'],
        ['Cung Trực Phù / Trực Sử', 'Điểm dừng chân'],
        ['Đỗ Môn', 'Hướng người đi lạc trốn'],
      ],
      signals: [
        ['Thời can và nhật can đồng cung', 'Dễ tìm được hoặc tự quay về'],
        ['Dụng thần có Cửu Địa / Thái Âm', 'Có người cất giấu'],
        ['Dụng thần có Huyền Vũ', 'Bị người khác lừa'],
        ['Dụng thần có Đằng Xà', 'Bị bắt giữ'],
        ['Dụng thần có Bạch Hổ', 'Đề phòng bị đánh'],
        ['Phục ngâm', 'Khó về'],
        ['Phản ngâm', 'Sẽ về'],
      ],
      how: 'Trước hết xác định đúng dụng thần theo quan hệ thân thuộc. Xem Lục Hợp để đoán hướng ban đầu, cung dụng thần để đoán hướng cuối. Phản ngâm = có cơ hội quay về; Phục ngâm = khó về.'
    },
    25: {
      title: '25. Mất đồ',
      vars: [
        ['Can ngày', 'Người chủ'],
        ['Can giờ', 'Tài sản bị mất'],
      ],
      signals: [
        ['Ngày giờ đồng cung', 'Không bị mất, sẽ tìm lại được'],
        ['Can giờ vượng sinh can ngày', 'Tìm lại được'],
        ['Phản ngâm', 'Tìm lại được'],
        ['Thời can không vong / mộ tuyệt', 'Khó tìm lại'],
        ['Can ngày + can giờ nội bàn', 'Mất trong nhà / nơi gần'],
        ['Can ngày + can giờ ngoại bàn', 'Mất ngoài nhà / nơi xa'],
        ['Can giờ có Huyền Vũ', 'Người khác lấy hoặc tự để quên'],
        ['Can giờ bị Huyền Vũ / Thiên Bồng khắc', 'Bị lấy trộm'],
        ['Huyền Vũ dương tính', 'Người lấy là đàn ông'],
        ['Huyền Vũ âm tính', 'Người lấy là phụ nữ'],
      ],
      how: 'Can giờ là món đồ. Xem nội bàn/ngoại bàn để định trong hay ngoài. Xem Huyền Vũ để đoán có người lấy, quên, hay nam/nữ liên quan.'
    },
    26: {
      title: '26. Thời tiết',
      vars: [
        ['Giáp / Ất', 'Gió'],
        ['Bính / Đinh', 'Lửa / nóng'],
        ['Mậu / Kỷ', 'Mây'],
        ['Canh / Tân', 'Băng tuyết'],
        ['Nhâm / Quý', 'Mưa'],
        ['Thiên Anh', 'Mặt trời'],
        ['Thiên Phụ', 'Gió'],
        ['Thiên Trụ / Thiên Bồng', 'Mưa'],
        ['Thiên Xung', 'Sấm'],
        ['Trực Phù / Cửu Thiên', 'Mặt trời'],
        ['Cửu Địa', 'Mây'],
        ['Lục Hợp / Bạch Hổ', 'Gió'],
        ['Huyền Vũ', 'Mưa'],
      ],
      signals: [
        ['Thiên Bồng + Nhâm/Quý + Khảm/Chấn/Đoài', 'Mưa (xác suất cao)'],
        ['Thiên Trụ + Nhâm/Quý + Khảm/Chấn/Đoài', 'Mưa (xác suất cao)'],
      ],
      how: 'Xem can chủ và sao chủ hiện ra gì để quy loại thời tiết. Nếu mưa xuất hiện đồng thời ở nhiều chỉ dấu (Nhâm Quý + Thiên Bồng/Thiên Trụ), xác suất mưa càng cao.'
    }
  };

  // ============================ HELPERS CHUYÊN SÂU ============================
  function getCurrentChart() { return window.__LAST_CHART || null; }
  function getPalace(chart, pos) { return (chart?.palaces || []).find(p => p.cung === pos) || null; }
  function getAllPalaces(chart) { return chart?.palaces || []; }

  function getStemOf(chart, pillar) {
    let can = chart?.fourPillars?.[pillar]?.can || '';
    if (can.includes(' ')) can = can.split(' ')[0];
    return can;
  }

  function getStemElement(stemVI) { return MAP_CAN[stemVI] || ''; }

  function sheng(a, b) {
    if (_U.tuongSinh) return _U.tuongSinh(a, b);
    return { 'Mộc':'Hỏa','Hỏa':'Thổ','Thổ':'Kim','Kim':'Thủy','Thủy':'Mộc' }[a] === b;
  }

  function khac(a, b) {
    if (_U.tuongKhac) return _U.tuongKhac(a, b);
    return { 'Mộc':'Thổ','Thổ':'Thủy','Thủy':'Hỏa','Hỏa':'Kim','Kim':'Mộc' }[a] === b;
  }

  function normalizeGateName(gateName) { return String(gateName || '').replace(/ ?[Mm]ôn$/, '').trim(); }

  function getEffectiveDeityName(palace, chart) {
    const raw = (palace?.batThan || '').trim();
    if (!raw) return '';
    if (!(!!chart?.ju?.isDuong)) {
      if (raw === 'Câu Trận') return 'Bạch Hổ';
      if (raw === 'Chu Tước') return 'Huyền Vũ';
    }
    return raw;
  }

  function findPalaceByGate(chart, gateName) {
    const gn = normalizeGateName(gateName);
    return getAllPalaces(chart).find(p => normalizeGateName(p.batMon) === gn) || null;
  }

  function findPalaceByStarName(chart, starName) {
    return getAllPalaces(chart).find(p =>
      (p.thienBan || '').includes(starName) || (p.thienBanDongCung || '').includes(starName)
    ) || null;
  }

  function findPalaceByDeityName(chart, deityName) {
    return getAllPalaces(chart).find(p => getEffectiveDeityName(p, chart).includes(deityName)) || null;
  }

  function getZhifuPalace(chart) { return chart?.zhiFu?.cung ? getPalace(chart, chart.zhiFu.cung) : null; }
  function getZhishiPalace(chart) { return chart?.zhiShi?.cung ? getPalace(chart, chart.zhiShi.cung) : null; }

  function isVoid(chart, palace) {
    if (!palace || !chart) return false;
    const kv = chart.tuanThu?.khongVong || [];
    const chiDaiDien = chart.palaces.find(p => p.cung === palace.cung)?.khongVong?.chiCung;
    return kv.includes(chiDaiDien);
  }

  function isHorse(chart, palace) { return palace?.isDichMa === true; }
  function getHeavenlyStem(palace) { return palace?.thienCanBan || ''; }
  function getEarthlyStem(palace) { return palace?.diaBan || ''; }

  function findPalaceByHeavenlyStem(chart, stemVI) {
    return getAllPalaces(chart).find(p => p.thienCanBan === stemVI) || null;
  }
  function findPalaceByEarthlyStem(chart, stemVI) {
    return getAllPalaces(chart).find(p => p.diaBan === stemVI) || null;
  }

  function hasPattern(palace, nameSubstr) {
    if (!palace || !Array.isArray(palace.patterns)) return false;
    return palace.patterns.some(p => (p.ten || '').toLowerCase().includes(nameSubstr.toLowerCase()));
  }

  function hasRuMu(palace) {
    if (!palace) return false;
    if (palace.isMoKho === true) return true;
    return hasPattern(palace, 'nhập mộ');
  }

  function hasGlobalPattern(chart, nameSubstr) {
    return getAllPalaces(chart).some(p => hasPattern(p, nameSubstr));
  }

  function getAllVoidPalaces(chart) { return getAllPalaces(chart).filter(p => isVoid(chart, p)); }

  function getCungMeta(pos, chart) {
    if (chart?.sys?.CUNG_META?.[pos]) return chart.sys.CUNG_META[pos];
    if (_U.CUNG_META?.[pos]) return _U.CUNG_META[pos];
    return FALLBACK_META[pos] || { ten: '', huong: '', hanh: '' };
  }

  function palaceName(pos, chart) { return getCungMeta(pos, chart).ten; }
  function palaceDirection(pos, chart) { return getCungMeta(pos, chart).huong; }
  function palaceElement(pos, chart) { return getCungMeta(pos, chart).hanh; }

  function palaceSummary(p, chart) {
    if (!p) return '—';
    const t = palaceName(p.cung, chart), d = palaceDirection(p.cung, chart);
    let parts = [];
    if (t) parts.push(t);
    if (d) parts.push(`(${d})`);
    if (p.batMon) parts.push(p.batMon);
    if (p.thienBan) parts.push(p.thienBan);
    const deity = getEffectiveDeityName(p, chart);
    if (deity) parts.push(deity);
    const hs = getHeavenlyStem(p), es = getEarthlyStem(p);
    if (hs || es) parts.push(`${hs || '—'}/${es || '—'}`);
    let badges = [];
    if (isVoid(chart, p)) badges.push('⭕ K.Vong');
    if (isHorse(chart, p)) badges.push('🐎 D.Mã');
    if (hasRuMu(p)) badges.push('🪦 Nhập Mộ');
    return badges.length ? `${parts.join(' · ')} [${badges.join(' ')}]` : parts.join(' · ');
  }

  function getRelationBetweenPalaces(pA, pB, chart) {
    if (!pA || !pB || !chart) return { rel: 'khong', label: 'Không rõ' };
    const hA = getCungMeta(pA.cung, chart).hanh;
    const hB = getCungMeta(pB.cung, chart).hanh;
    if (sheng(hA, hB)) return { rel: 'a_sinh_b', label: `${hA} sinh ${hB}` };
    if (sheng(hB, hA)) return { rel: 'b_sinh_a', label: `${hB} sinh ${hA}` };
    if (khac(hA, hB)) return { rel: 'a_khac_b', label: `${hA} khắc ${hB}` };
    if (khac(hB, hA)) return { rel: 'b_khac_a', label: `${hB} khắc ${hA}` };
    if (hA === hB) return { rel: 'dong_hanh', label: `Tỷ hòa (${hA})` };
    return { rel: 'khong', label: 'Không rõ' };
  }

  // So sánh ngũ hành của 2 can (thiên can thiên bàn)
  function getRelationBetweenStems(stemA, stemB) {
    const hA = MAP_CAN[stemA] || '', hB = MAP_CAN[stemB] || '';
    if (!hA || !hB) return { rel: 'khong', label: 'Không rõ' };
    if (sheng(hA, hB)) return { rel: 'a_sinh_b', label: `${stemA}(${hA}) sinh ${stemB}(${hB})` };
    if (sheng(hB, hA)) return { rel: 'b_sinh_a', label: `${stemB}(${hB}) sinh ${stemA}(${hA})` };
    if (khac(hA, hB)) return { rel: 'a_khac_b', label: `${stemA}(${hA}) khắc ${stemB}(${hB})` };
    if (khac(hB, hA)) return { rel: 'b_khac_a', label: `${stemB}(${hB}) khắc ${stemA}(${hA})` };
    if (hA === hB) return { rel: 'dong_hanh', label: `${stemA} & ${stemB} Tỷ hòa (${hA})` };
    return { rel: 'khong', label: 'Không rõ' };
  }

  function getGrowthStage(palace, stem, chart) {
    if (!palace || !stem || !chart) return '';
    const dayHS = getStemOf(chart, 'day'), hourHS = getStemOf(chart, 'hour');
    if (stem === dayHS) return palace.growthCycle?.dayStem || '';
    if (stem === hourHS) return palace.growthCycle?.hourStem || '';
    if (palace.thienCanBan === stem) return palace.growthCycle?.heavenlyStem || '';
    if (palace.diaBan === stem) return palace.growthCycle?.earthlyStem || '';
    return '';
  }

  // Kiểm tra Thiên Can bàn thuộc loại nào
  function isYangStem(stem) {
    return ['Giáp','Bính','Mậu','Canh','Nhâm'].includes(stem);
  }
  function isYinStem(stem) {
    return ['Ất','Đinh','Kỷ','Tân','Quý'].includes(stem);
  }

  // Kiểm tra Bát Môn thuộc dương/âm
  function isYangGate(gateName) {
    const g = normalizeGateName(gateName);
    return ['Khai','Sinh','Thương','Đỗ'].includes(g);
  }
  function isYinGate(gateName) {
    const g = normalizeGateName(gateName);
    return ['Hưu','Cảnh','Tử','Kinh'].includes(g);
  }

  // Kiểm tra Cửu Tinh thuộc dương/âm
  function isYangStar(starName) {
    return ['Thiên Xung','Thiên Phụ','Thiên Anh','Thiên Tâm','Thiên Cầm'].some(s => (starName || '').includes(s));
  }

  // Xác định vượng/suy nhanh theo cung và thiên can
  function getWangShuaiLabel(growthStage) {
    const strong = ['Đế Vượng','Trường Sinh','Lâm Quan','Mộc Dục','Quan Đới'];
    const weak = ['Tử','Mộ','Tuyệt','Bệnh','Suy'];
    if (strong.includes(growthStage)) return { label: growthStage, type: 'good' };
    if (weak.includes(growthStage)) return { label: growthStage, type: 'bad' };
    return { label: growthStage || '—', type: 'neutral' };
  }

  // Đọc các cách cục từ palace
  function getPatternsOf(palace) {
    if (!palace || !Array.isArray(palace.patterns)) return { bad: [], good: [], all: [] };
    const bad = palace.patterns.filter(p => p.loai === 'hung').map(p => p.ten);
    const good = palace.patterns.filter(p => p.loai === 'cat').map(p => p.ten);
    return { bad, good, all: [...bad, ...good] };
  }

  // Kiểm tra xem cung có phải là cung của Trực Phù/Trực Sử
  function isZhifuCung(chart, palace) {
    return palace && chart?.zhiFu?.cung === palace.cung;
  }
  function isZhishiCung(chart, palace) {
    return palace && chart?.zhiShi?.cung === palace.cung;
  }

  // Tính điểm cát/hung của một cung theo Bát Môn
  function getGateScore(gateName) {
    const g = normalizeGateName(gateName);
    const scores = { 'Khai':3,'Sinh':3,'Hưu':2,'Thương':-1,'Đỗ':1,'Cảnh':0,'Tử':-3,'Kinh':-2 };
    return scores[g] !== undefined ? scores[g] : 0;
  }

  // Tính điểm cát/hung của một cung theo Bát Thần
  function getDeityScore(deityName) {
    const scores = {
      'Trực Phù':3,'Thái Âm':2,'Lục Hợp':2,'Cửu Thiên':1,'Cửu Địa':1,
      'Đằng Xà':-2,'Bạch Hổ':-2,'Huyền Vũ':-2,'Câu Trần':-1,'Chu Tước':-1
    };
    for (const [k,v] of Object.entries(scores)) {
      if (deityName && deityName.includes(k)) return v;
    }
    return 0;
  }

  // Tính điểm cát/hung của một cung theo Cửu Tinh
  function getStarScore(starName) {
    const scores = {
      'Thiên Phụ':3,'Thiên Tâm':2,'Thiên Nhậm':1,'Thiên Anh':1,'Thiên Xung':0,
      'Thiên Cầm':0,'Thiên Nhuế':-1,'Thiên Bồng':-2,'Thiên Trụ':-2
    };
    for (const [k,v] of Object.entries(scores)) {
      if (starName && starName.includes(k)) return v;
    }
    return 0;
  }

  // Phân tích toàn diện một cung - trả về score đóng góp
  function analyzePalaceFull(palace, roleName, chart) {
    if (!palace) return { html: line(roleName, 'Ẩn phục / Không xác định được', 'neutral'), score: 0 };

    let html = '', score = 0;
    const hs = getHeavenlyStem(palace), es = getEarthlyStem(palace);
    const deity = getEffectiveDeityName(palace, chart);
    const star = palace.thienBan || '';
    const gate = palace.batMon || '';
    const pats = getPatternsOf(palace);
    const cungHanh = getCungMeta(palace.cung, chart).hanh;
    const gateScore = getGateScore(gate);
    const deityScore = getDeityScore(deity);
    const starScore = getStarScore(star);
    score += gateScore + deityScore + starScore;

    html += line(roleName, palaceSummary(palace, chart), gateScore >= 2 ? 'good' : (gateScore <= -2 ? 'bad' : 'info'));

    // Ngũ hành tương tác giữa Thiên Can và Địa Bàn cung
    if (hs && es) {
      const relHsEs = getRelationBetweenStems(hs, es);
      let relType = 'neutral';
      if (relHsEs.rel === 'a_sinh_b') { relType = 'good'; score += 1; }
      else if (relHsEs.rel === 'b_sinh_a') { relType = 'good'; score += 1; }
      else if (relHsEs.rel === 'a_khac_b') { relType = 'bad'; score -= 1; }
      else if (relHsEs.rel === 'b_khac_a') { relType = 'bad'; score -= 1; }
      html += line('  ↳ Thiên/Địa bàn', relHsEs.label, relType);
    }

    // Vượng suy
    const gs = getGrowthStage(palace, hs, chart);
    if (gs) {
      const ws = getWangShuaiLabel(gs);
      html += line('  ↳ Vượng/Suy', ws.label, ws.type);
      if (ws.type === 'good') score += 1;
      else if (ws.type === 'bad') score -= 1;
    }

    // Bát Môn
    if (gate) html += line('  ↳ Bát Môn', `${gate} (điểm: ${gateScore >= 0 ? '+' : ''}${gateScore})`, gateScore >= 2 ? 'good' : (gateScore <= -1 ? 'bad' : 'neutral'));

    // Bát Thần
    if (deity) html += line('  ↳ Bát Thần', `${deity} (điểm: ${deityScore >= 0 ? '+' : ''}${deityScore})`, deityScore >= 1 ? 'good' : (deityScore <= -1 ? 'bad' : 'neutral'));

    // Cửu Tinh
    if (star) html += line('  ↳ Cửu Tinh', `${star} (điểm: ${starScore >= 0 ? '+' : ''}${starScore})`, starScore >= 1 ? 'good' : (starScore <= -1 ? 'bad' : 'neutral'));

    // Trạng thái đặc biệt
    if (isVoid(chart, palace)) { html += line('  ↳ ⭕ Không Vong', 'Ảo, trống rỗng, không thực chất', 'bad'); score -= 2; }
    if (hasRuMu(palace)) { html += line('  ↳ 🪦 Nhập Mộ', 'Bị phong bế, chôn vùi, tắc nghẽn', 'bad'); score -= 2; }
    if (isHorse(chart, palace)) { html += line('  ↳ 🐎 Dịch Mã', 'Di chuyển, thay đổi, bôn ba', 'neutral'); }

    // Cách cục
    if (pats.good.length) { html += line('  ↳ Cát cách', pats.good.join(', '), 'good'); score += pats.good.length; }
    if (pats.bad.length) { html += line('  ↳ Hung cách', pats.bad.join(', '), 'bad'); score -= pats.bad.length; }

    return { html, score };
  }

  // ============================ UI FORMATTING ============================
  function h(s) { return s; }

  function line(label, value, type) {
    let cls = '';
    if (type === 'good') cls = 'style="color:var(--good, #16a34a);"';
    else if (type === 'bad') cls = 'style="color:var(--bad, #dc2626);"';
    else if (type === 'neutral') cls = 'style="color:var(--muted, #6b7280);"';
    else if (type === 'info') cls = 'style="color:#1e40af;"';
    return `<div style="margin-bottom:5px; font-size: 14px;"><strong>${label}:</strong> <span ${cls}>${value}</span></div>`;
  }

  function section(title) {
    return `<div style="margin:14px 0 7px 0;font-weight:700;border-left:4px solid #8a1f1f;padding-left:10px; background:#f9f4f4; padding-top:5px; padding-bottom:5px; border-radius:2px; font-size:13.5px;">${title}</div>`;
  }

  function note(text, type) {
    let bg = '#fefce8', border = '#ca8a04', color = '#713f12';
    if (type === 'good') { bg = '#f0fdf4'; border = '#16a34a'; color = '#14532d'; }
    else if (type === 'bad') { bg = '#fef2f2'; border = '#dc2626'; color = '#7f1d1d'; }
    return `<div style="margin:6px 0;padding:8px 10px;background:${bg};border-left:4px solid ${border};color:${color}; font-size:13px; line-height:1.6;">${text}</div>`;
  }

  function verdict(text, type) {
    let bg = '#f3f4f6', color = '#1f2937';
    if (type === 'good') { bg = '#dcfce7'; color = '#14532d'; }
    else if (type === 'bad') { bg = '#fee2e2'; color = '#7f1d1d'; }
    else if (type === 'warn') { bg = '#fef9c3'; color = '#713f12'; }
    return `<div style="margin:6px 0 0 0; padding:6px 10px; background:${bg}; border-radius:4px; font-size:13px; font-weight:600; color:${color};">${text}</div>`;
  }

    // ============================ SỬA: summarizeResult — CHỈ GIỮ ĐIỂM SỐ + MÀU ============================
  function summarizeResult(score) {
    let bg = '', color = '', label = '';
    if (score >= 6)       { bg = '#dcfce7'; color = '#14532d'; label = '✅ Đại Cát'; }
    else if (score >= 3)  { bg = '#d1fae5'; color = '#166534'; label = '✅ Cát'; }
    else if (score > 0)   { bg = '#f0fdf4'; color = '#166534'; label = '🌤️ Tiểu Cát'; }
    else if (score === 0) { bg = '#f3f4f6'; color = '#1f2937'; label = '⚖️ Bình'; }
    else if (score >= -3) { bg = '#fef9c3'; color = '#713f12'; label = '⚠️ Tiểu Hung'; }
    else if (score >= -6) { bg = '#fee2e2'; color = '#991b1b'; label = '❌ Hung'; }
    else                  { bg = '#fecaca'; color = '#7f1d1d'; label = '❌ Đại Hung'; }
    return `<div style="margin-top:18px;padding:10px 16px;background:${bg};border-radius:6px;font-weight:bold;font-size:15px;border:1px solid rgba(0,0,0,0.1);color:${color};display:flex;justify-content:space-between;align-items:center;"><span>${label}</span><span style="font-size:18px;letter-spacing:1px;">${score >= 0 ? '+' : ''}${score} điểm</span></div>`;
  }

  function renderTopicGuide(topicId) {
    const t = TOPIC_GUIDES[topicId];
    if (!t) return '<div style="color:var(--muted);">Chọn chủ đề để xem hướng dẫn.</div>';
    let html = `<div style="font-weight:700;color:#7f1d1d;margin-bottom:6px;font-size:12px;">${t.title}</div>`;
    if (t.vars && t.vars.length) {
      html += `<div style="font-weight:700;color:#374151;margin-bottom:2px;">📌 Biến số:</div>`;
      html += `<table style="width:100%;border-collapse:collapse;margin-bottom:6px;">`;
      for (const [k, v] of t.vars) {
        html += `<tr><td style="padding:1px 4px 1px 0;vertical-align:top;width:40%;color:#1d4ed8;font-weight:700;font-size:12px;">${h(k)}</td><td style="padding:1px 0;vertical-align:top;font-size:12px;color:#374151;">${h(v)}</td></tr>`;
      }
      html += `</table>`;
    }
    if (t.signals && t.signals.length) {
      html += `<div style="font-weight:700;color:#374151;margin-bottom:2px;">⚡ Tín hiệu đặc biệt:</div>`;
      html += `<table style="width:100%;border-collapse:collapse;margin-bottom:6px;">`;
      for (const [k, v] of t.signals) {
        html += `<tr><td style="padding:1px 4px 1px 0;vertical-align:top;width:50%;color:#b45309;font-size:11px;">${h(k)}</td><td style="padding:1px 0;vertical-align:top;font-size:11px;color:#374151;">→ ${h(v)}</td></tr>`;
      }
      html += `</table>`;
    }
    if (t.how) {
      html += `<div style="font-weight:700;color:#374151;margin-bottom:2px;">📖 Cách xem nhanh:</div>`;
      html += `<div style="font-size:11px;color:#374151;line-height:1.6;border-left:3px solid #8a1f1f;padding-left:7px;background:#fdf8f8;padding-top:3px;padding-bottom:3px;">${h(t.how)}</div>`;
    }
    return html;
  }

  // ============================ PHÂN TÍCH CHUYÊN SÂU 26 CHỦ ĐỀ ============================
  const TOPIC_ANALYZERS = {};

  // ===== CHỦ ĐỀ 1: CƠ THỂ / BỆNH LÝ =====
  TOPIC_ANALYZERS[1] = function(chart) {
    let score = 0, html = '';
    const dayHS = getStemOf(chart, 'day');
    const hourHS = getStemOf(chart, 'hour');
    const pDay = findPalaceByHeavenlyStem(chart, dayHS);
    const pHour = findPalaceByHeavenlyStem(chart, hourHS);
    const pNhue = findPalaceByStarName(chart, 'Thiên Nhuế');

    // --- Bản thân ---
    html += section('🧑 Bản Thân (Can Ngày)');
    const rDay = analyzePalaceFull(pDay, `Can Ngày [${dayHS}]`, chart);
    html += rDay.html; score += rDay.score * 0.5;

    // --- Bộ phận cơ thể theo Thiên Can ---
    html += section('🩺 Bộ Phận Cơ Thể Liên Quan');
    const MAP_BODY = {
      'Giáp':'Đầu, gan, túi mật','Ất':'Gan, túi mật, thực quản, cổ họng, thần kinh',
      'Bính':'Ruột non, môi, vai, trán','Đinh':'Răng, tim, mắt (trào ngược, bốc hỏa)',
      'Mậu':'Cơ bụng, bao tử, mũi','Kỷ':'Mắt, tỳ tạng, miệng, bụng',
      'Canh':'Xương, sườn, ruột già','Tân':'Phổi, phế quản, ngực, cổ, bụng',
      'Nhâm':'Tim mạch, bàng quang, máu, hệ thực vật','Quý':'Thần kinh, chân, thận'
    };

    // Quét tất cả thiên can nổi bật để xác định bộ phận có vấn đề
    const allStems = ['Giáp','Ất','Bính','Đinh','Mậu','Kỷ','Canh','Tân','Nhâm','Quý'];
    let bodyFindings = [];
    for (const stem of allStems) {
      const p = findPalaceByHeavenlyStem(chart, stem);
      if (!p) continue;
      const isProblematic = isVoid(chart, p) || hasRuMu(p) ||
        (pNhue && pNhue.cung === p.cung) ||
        getRelationBetweenStems(dayHS, stem).rel === 'a_khac_b';
      if (isProblematic && MAP_BODY[stem]) {
        bodyFindings.push({ stem, body: MAP_BODY[stem], palace: p });
      }
    }

    if (bodyFindings.length) {
      for (const f of bodyFindings) {
        const reasons = [];
        if (isVoid(chart, f.palace)) reasons.push('Không Vong');
        if (hasRuMu(f.palace)) reasons.push('Nhập Mộ');
        if (pNhue && pNhue.cung === f.palace.cung) reasons.push('Thiên Nhuế đóng cùng');
        if (getRelationBetweenStems(dayHS, f.stem).rel === 'a_khac_b') reasons.push('Bị Can Ngày áp chế');
        html += line(`⚠️ ${f.stem} → ${f.body}`, `[${reasons.join(', ')}]`, 'bad');
        score -= reasons.length;
      }
    } else {
      html += note('Không phát hiện can nào có dấu hiệu bệnh lý rõ ràng. Cơ thể tương đối ổn định.', 'good');
      score += 1;
    }

    // --- Thiên Nhuế: Sao Bệnh ---
    html += section('🌡️ Thiên Nhuế (Sao Bệnh Tật)');
    if (pNhue) {
      const rNhue = analyzePalaceFull(pNhue, 'Thiên Nhuế', chart);
      html += rNhue.html;
      // Quan hệ Bệnh ↔ Người
      if (pDay) {
        const rel = getRelationBetweenPalaces(pNhue, pDay, chart);
        html += section('⚔️ Tương Quan Bệnh ↔ Bản Thân');
        html += line('Quan hệ ngũ hành', rel.label, rel.rel.includes('khac') ? 'bad' : 'good');
        if (rel.rel === 'a_khac_b') {
          html += note('🔴 Bệnh khắc Bản thân (Thiên Nhuế khắc Can Ngày): Bệnh đang tấn công mạnh, sức đề kháng suy yếu. Tình trạng diễn biến xấu, cần can thiệp y tế gấp.', 'bad'); score -= 3;
        } else if (rel.rel === 'b_khac_a') {
          html += note('🟢 Bản thân khắc Bệnh: Cơ thể đang kiểm soát được bệnh, đang trên đà hồi phục. Tiếp tục điều trị là đủ.', 'good'); score += 3;
        } else if (rel.rel === 'a_sinh_b' || rel.rel === 'b_sinh_a') {
          html += note('🟡 Bệnh và Bản thân tương sinh: Bệnh ăn sâu, tương trợ lẫn nhau — bệnh mãn tính, dai dẳng, khó dứt điểm.', 'bad'); score -= 1;
        } else if (rel.rel === 'dong_hanh') {
          html += note('🟡 Tỷ hòa: Bệnh kéo dài nhưng không quá trầm trọng, trạng thái giằng co.'); score -= 1;
        }
      }
      if (isVoid(chart, pNhue)) { html += note('⭕ Thiên Nhuế Không Vong: Bệnh chưa thực sự nghiêm trọng, có thể chỉ là lo lắng ảo, hoặc bệnh mới chớm dễ chữa.', 'good'); score += 2; }
      if (hasRuMu(pNhue)) { html += note('🪦 Thiên Nhuế Nhập Mộ: Bệnh âm ỉ kéo dài, khó phát hiện rõ nguồn gốc — cần xét nghiệm toàn diện.', 'bad'); score -= 1; }
    } else {
      html += note('Thiên Nhuế ẩn phục: Bệnh chưa bùng phát rõ ràng hoặc đang trong giai đoạn tiền bệnh.', 'neutral');
    }

    // --- Xác định bộ phận của Can Ngày và Can Giờ ---
    html += section('🔎 Bộ Phận Nghi Vấn Chính (Can Ngày & Giờ)');
    if (MAP_BODY[dayHS]) html += line(`Can Ngày [${dayHS}]`, MAP_BODY[dayHS], 'info');
    if (MAP_BODY[hourHS]) html += line(`Can Giờ [${hourHS}]`, MAP_BODY[hourHS], 'info');

    // --- Chỉ dấu đặc biệt ---
    html += section('🔬 Chỉ Dấu Bệnh Lý Đặc Thù');
    const pBinh = findPalaceByHeavenlyStem(chart, 'Bính');
    const pMauKy = findPalaceByHeavenlyStem(chart, 'Mậu') || findPalaceByHeavenlyStem(chart, 'Kỷ');
    const pDinh = findPalaceByHeavenlyStem(chart, 'Đinh');
    const pNhamQuy = findPalaceByHeavenlyStem(chart, 'Nhâm') || findPalaceByHeavenlyStem(chart, 'Quý');
    const pKhai = findPalaceByGate(chart, 'Khai');

    if (pBinh && pBinh.cung === pDay?.cung) { html += note('Bính đồng cung Can Ngày: Có dấu hiệu viêm nhiễm, sốt cao.', 'bad'); score -= 1; }
    if (pMauKy && (hasRuMu(pMauKy) || isVoid(chart, pMauKy))) { html += note('Mậu/Kỷ bất thường: Nghi ngờ u bướu, nang, hoặc vết sẹo tiềm ẩn.', 'bad'); score -= 1; }
    if (pDinh && pKhai && pDinh.cung === pDay?.cung) { html += note('Đinh + Khai Môn đồng cung với Can Ngày: Dấu hiệu đã hoặc sắp phẫu thuật.', 'bad'); score -= 1; }
    if (pNhamQuy && getEffectiveDeityName(pNhamQuy, chart).includes('Bạch Hổ')) { html += note('Nhâm/Quý gặp Bạch Hổ: Nghi ngờ vấn đề máu huyết, huyết áp, hoặc chấn thương.', 'bad'); score -= 1; }

    // --- Chỗ điều trị ---
    html += section('💊 Phương Án Điều Trị');
    const pTam = findPalaceByStarName(chart, 'Thiên Tâm');
    const pAt = findPalaceByHeavenlyStem(chart, 'Ất');
    if (pTam) {
      const rTam = analyzePalaceFull(pTam, 'Thiên Tâm (Tây Y)', chart);
      html += rTam.html;
      if (pNhue && pTam) {
        const relTreat = getRelationBetweenPalaces(pTam, pNhue, chart);
        if (relTreat.rel === 'a_khac_b') { html += note('🟢 Tây y khắc bệnh: Gặp đúng thầy đúng thuốc, điều trị sẽ hiệu quả.', 'good'); score += 2; }
        else { html += note('🟡 Tây y chưa khắc được bệnh: Cân nhắc đổi phương pháp hoặc kết hợp Đông y.'); score -= 1; }
      }
    }
    if (pAt) {
      html += line('Ất (Đông Y)', palaceSummary(pAt, chart), isVoid(chart, pAt) ? 'bad' : 'good');
      if (isVoid(chart, pAt)) { html += note('Đông y Không Vong: Thuốc nam, châm cứu hiệu quả kém trong giai đoạn này.', 'bad'); }
    }

    // Cung Sinh Môn / Tử Môn với người bệnh
    const pSinh = findPalaceByGate(chart, 'Sinh');
    const pTu = findPalaceByGate(chart, 'Tử');
    if (pDay && pSinh && pDay.cung === pSinh.cung) { html += note('🟢 Bản thân đồng cung Sinh Môn: Hồi phục nhanh, sinh lực mạnh.', 'good'); score += 2; }
    if (pDay && pTu && pDay.cung === pTu.cung) { html += note('🔴 Bản thân đồng cung Tử Môn: Bệnh nặng, hồi phục chậm và khó khăn.', 'bad'); score -= 3; }

    return { html, score };
  };

  // ===== CHỦ ĐỀ 2: NGHỀ NGHIỆP =====
  TOPIC_ANALYZERS[2] = function(chart) {
    let score = 0, html = '';
    const dayHS = getStemOf(chart, 'day');
    const monthHS = getStemOf(chart, 'month');
    const yearHS = getStemOf(chart, 'year');
    const hourHS = getStemOf(chart, 'hour');
    const pDay = findPalaceByHeavenlyStem(chart, dayHS);
    const pYear = findPalaceByHeavenlyStem(chart, yearHS);
    const pMonth = findPalaceByHeavenlyStem(chart, monthHS);
    const pHour = findPalaceByHeavenlyStem(chart, hourHS);
    const pKhai = findPalaceByGate(chart, 'Khai');
    const pSinh = findPalaceByGate(chart, 'Sinh');
    const pDo = findPalaceByGate(chart, 'Đỗ');
    const pZF = getZhifuPalace(chart);
    let pThaiTue = chart?.thaiTue?.cung ? getPalace(chart, chart.thaiTue.cung) : null;

    // --- Bản thân ---
    html += section('🧑 Bản Thân (Can Ngày)');
    const rDay = analyzePalaceFull(pDay, `Can Ngày [${dayHS}]`, chart);
    html += rDay.html; score += rDay.score;

    // --- Sự nghiệp (Khai Môn) ---
    html += section('💼 Sự Nghiệp (Khai Môn)');
    const rKhai = analyzePalaceFull(pKhai, 'Khai Môn', chart);
    html += rKhai.html; score += rKhai.score;

    if (pKhai && pDay) {
      const rel = getRelationBetweenPalaces(pKhai, pDay, chart);
      html += line('Khai Môn ↔ Bản thân', rel.label, rel.rel.includes('sinh') ? 'good' : rel.rel.includes('khac') ? 'bad' : 'neutral');
      if (rel.rel === 'a_sinh_b') { html += note('🟢 Sự nghiệp sinh trợ bản thân: Công việc phù hợp năng lực, dễ thăng tiến.', 'good'); score += 2; }
      else if (rel.rel === 'b_sinh_a') { html += note('🟡 Bản thân sinh cho công việc: Phải bỏ công sức nhiều nhưng có kết quả.'); score += 1; }
      else if (rel.rel === 'a_khac_b') { html += note('🔴 Công việc áp chế bản thân: Stress cao, môi trường độc hại, khó phát triển.', 'bad'); score -= 2; }
      else if (rel.rel === 'b_khac_a') { html += note('🟡 Bản thân khắc công việc: Kiểm soát được công việc nhưng hao tổn sức lực.'); score -= 1; }
    }

    if (pKhai && isVoid(chart, pKhai)) { html += note('⭕ Khai Môn Không Vong: Công việc đình trệ, nguy cơ mất việc hoặc cơ hội bị hủy bỏ.', 'bad'); score -= 3; }
    if (pKhai && hasRuMu(pKhai)) { html += note('🪦 Khai Môn Nhập Mộ: Sự nghiệp bị phong bế, dễ mắc sai phạm hoặc bị điều tra.', 'bad'); score -= 2; }
    if (pKhai && hasPattern(pKhai, 'phản ngâm')) { html += note('🔄 Khai Môn Phản Ngâm: Sắp có biến động lớn về nghề nghiệp — thay đổi, chuyển hướng.'); score -= 1; }
    if (pKhai && hasPattern(pKhai, 'phục ngâm')) { html += note('⏸️ Khai Môn Phục Ngâm: Sự nghiệp giậm chân tại chỗ, không tiến không lùi.'); score -= 1; }

    // --- Tài lộc (Sinh Môn) ---
    html += section('💰 Tài Lộc & Lương Thưởng (Sinh Môn)');
    const rSinh = analyzePalaceFull(pSinh, 'Sinh Môn', chart);
    html += rSinh.html; score += rSinh.score * 0.5;
    if (pSinh && pDay) {
      const rel2 = getRelationBetweenPalaces(pSinh, pDay, chart);
      if (rel2.rel === 'a_sinh_b') { html += note('🟢 Tài lộc sinh bản thân: Thu nhập tốt, lương thưởng xứng đáng.', 'good'); score += 2; }
      else if (rel2.rel === 'b_khac_a') { html += note('🟡 Bản thân tốn tiền cho công việc: Chi phí cao, bỏ vốn nhiều hơn thu về.'); score -= 1; }
    }
    if (pSinh && isVoid(chart, pSinh)) { html += note('⭕ Sinh Môn Không Vong: Lương thưởng thực tế thấp hơn kỳ vọng, tiền bạc hư ảo.', 'bad'); score -= 2; }

    // --- Cấp dưới ---
    html += section('👥 Nhân Viên Cấp Dưới (Can Giờ)');
    const rHour = analyzePalaceFull(pHour, `Can Giờ [${hourHS}]`, chart);
    html += rHour.html;
    if (pHour && pDay) {
      const rel3 = getRelationBetweenStems(hourHS, dayHS);
      if (rel3.rel === 'a_sinh_b') { html += note('🟢 Cấp dưới hỗ trợ sếp tốt: Nhóm làm việc hiệu quả, trợ lực mạnh.', 'good'); score += 1; }
      else if (rel3.rel === 'a_khac_b') { html += note('🔴 Cấp dưới chống đối hoặc phá hoại: Cần cẩn thận với người phụ thuộc mình.', 'bad'); score -= 2; }
    }

    // --- Đồng nghiệp ---
    html += section('🤝 Đồng Nghiệp (Can Tháng)');
    const rMonth = analyzePalaceFull(pMonth, `Can Tháng [${monthHS}]`, chart);
    html += rMonth.html;

    // --- Quan hệ cấp trên ---
    html += section('👔 Cấp Trên (Trực Phù / Thái Tuế)');
    if (pZF) {
      const rZF = analyzePalaceFull(pZF, 'Trực Phù (Sếp Trực Tiếp)', chart);
      html += rZF.html;
      if (pDay) {
        const relBoss = getRelationBetweenPalaces(pZF, pDay, chart);
        if (relBoss.rel === 'a_sinh_b') { html += note('🟢 Sếp sinh người: Được nâng đỡ, tạo điều kiện, cơ hội thăng tiến cao.', 'good'); score += 3; }
        else if (relBoss.rel === 'a_khac_b') { html += note('🔴 Sếp khắc người: Bị chèn ép, gây khó dễ, quan hệ căng thẳng.', 'bad'); score -= 3; }
        else if (relBoss.rel === 'b_khac_a') { html += note('🟡 Người khắc sếp: Dễ bất đồng ý kiến, thể hiện cá tính mạnh — cẩn thận xung đột.'); score -= 1; }
        else { html += note('Quan hệ với sếp: Tương đối hòa hợp, không có xung đột lớn.', 'good'); score += 1; }
      }
    }

    if (pThaiTue) {
      const rTT = analyzePalaceFull(pThaiTue, 'Thái Tuế (Sếp Siêu Lớn)', chart);
      html += rTT.html;
      if (pDay) {
        const relTT = getRelationBetweenPalaces(pThaiTue, pDay, chart);
        if (relTT.rel === 'a_khac_b') { html += note('🔴 Thái Tuế khắc bản thân: Không hợp ban lãnh đạo cấp cao, khó được đề bạt.', 'bad'); score -= 2; }
        else if (relTT.rel === 'a_sinh_b') { html += note('🟢 Thái Tuế sinh bản thân: Được lãnh đạo cao tầng quan tâm, cơ hội lớn.', 'good'); score += 2; }
      }
    }

    // --- Cung sao môi trường ---
    html += section('🌐 Môi Trường Làm Việc (Cửu Tinh)');
    const pPhu = findPalaceByStarName(chart, 'Thiên Phụ');
    const pBong = findPalaceByStarName(chart, 'Thiên Bồng');
    const pNham = findPalaceByStarName(chart, 'Thiên Nhậm');
    const pTam = findPalaceByStarName(chart, 'Thiên Tâm');
    const pXung = findPalaceByStarName(chart, 'Thiên Xung');

    if (pPhu) { html += note(`🟢 Thiên Phụ ở Cung ${palaceName(pPhu.cung, chart)} (${palaceDirection(pPhu.cung, chart)}): Môi trường làm việc hỗ trợ, ổn định, có người đỡ đầu.`, 'good'); score += 1; }
    if (pNham) { html += note(`🟢 Thiên Nhậm: Được hỗ trợ từ cả cấp trên lẫn cấp dưới — vị trí trung gian thuận lợi.`, 'good'); score += 1; }
    if (pTam) { html += note(`🟢 Thiên Tâm: Sếp có năng lực, quyết đoán — môi trường chuyên nghiệp.`, 'good'); score += 1; }
    if (pXung && pDay && pXung.cung === pDay.cung) { html += note('🔴 Thiên Xung đồng cung bản thân: Áp lực công việc rất lớn, liên tục bị thúc ép.', 'bad'); score -= 2; }
    if (pBong && pDay && pBong.cung === pDay.cung) { html += note('🔴 Thiên Bồng đồng cung bản thân: Bị sếp hoặc đồng nghiệp chèn ép, môi trường độc hại.', 'bad'); score -= 2; }

    // --- Công việc tương lai ---
    html += section('🔮 Triển Vọng (Đỗ Môn)');
    const rDo = analyzePalaceFull(pDo, 'Đỗ Môn (Dự án/Công việc tới)', chart);
    html += rDo.html;
    if (pDo && isVoid(chart, pDo)) { html += note('⭕ Đỗ Môn Không Vong: Dự án/kế hoạch sắp tới chưa chắc chắn, dễ bị hủy.', 'bad'); score -= 1; }

    return { html, score };
  };

  // ===== CHỦ ĐỀ 3: THĂNG CHỨC =====
  TOPIC_ANALYZERS[3] = function(chart) {
    let score = 0, html = '';
    const dayHS = getStemOf(chart, 'day');
    const yearHS = getStemOf(chart, 'year');
    const pDay = findPalaceByHeavenlyStem(chart, dayHS);
    const pYear = findPalaceByHeavenlyStem(chart, yearHS);
    const pKhai = findPalaceByGate(chart, 'Khai');
    const pDo = findPalaceByGate(chart, 'Đỗ');
    const pZF = getZhifuPalace(chart);
    let pThaiTue = chart?.thaiTue?.cung ? getPalace(chart, chart.thaiTue.cung) : null;

    // --- Bản thân ---
    html += section('🧑 Bản Thân & Thực Lực');
    const rDay = analyzePalaceFull(pDay, `Can Ngày [${dayHS}]`, chart);
    html += rDay.html; score += rDay.score;
    if (pDay && isVoid(chart, pDay)) { html += note('⭕ Bản thân Không Vong: Thực lực đang rỗng tuếch, chưa đủ điều kiện được cất nhắc.', 'bad'); score -= 2; }

    // --- Quyết định thăng chức (Khai Môn) ---
    html += section('📋 Quyết Định Thăng Chức (Khai Môn)');
    const rKhai = analyzePalaceFull(pKhai, 'Khai Môn', chart);
    html += rKhai.html; score += rKhai.score;

    if (pKhai && pDay) {
      const rel = getRelationBetweenPalaces(pKhai, pDay, chart);
      html += line('Khai Môn ↔ Bản thân', rel.label, rel.rel.includes('sinh') ? 'good' : rel.rel.includes('khac') ? 'bad' : 'neutral');
      if (rel.rel === 'a_sinh_b') { html += note('🟢 Khai Môn sinh bản thân: Quyết định chính thức ủng hộ — khả năng thăng chức CỰC CAO.', 'good'); score += 4; }
      else if (rel.rel === 'dong_hanh') { html += note('🟢 Tỷ hòa: Quyết định thuận chiều bản thân — thăng chức khả thi cao.', 'good'); score += 2; }
      else if (rel.rel === 'b_sinh_a') { html += note('🟡 Bản thân sinh cho quyết định: Cần phải tự chứng minh thêm, chưa có kết luận.'); score += 1; }
      else if (rel.rel === 'a_khac_b') { html += note('🔴 Khai Môn khắc bản thân: Quyết định đi ngược lại mong muốn — thăng chức thất bại hoặc vị trí mới nhiều thử thách.', 'bad'); score -= 3; }
      else if (rel.rel === 'b_khac_a') { html += note('🟡 Bản thân khắc Khai Môn: Bản thân muốn nhưng tổ chức chưa sẵn sàng — cần vận động thêm.'); score -= 1; }
    }
    if (pKhai && isVoid(chart, pKhai)) { html += note('⭕ Khai Môn Không Vong: Chưa có quyết định thực sự, hồ sơ đang bị treo hoặc bị bỏ qua.', 'bad'); score -= 3; }
    if (pKhai && hasRuMu(pKhai)) { html += note('🪦 Khai Môn Nhập Mộ: Hội đồng xét duyệt bị phong tỏa, phiên xem xét bị hoãn vô thời hạn.', 'bad'); score -= 2; }

    // --- Người đề bạt (Đỗ Môn) ---
    html += section('🙋 Người Push Hồ Sơ (Đỗ Môn)');
    const rDo = analyzePalaceFull(pDo, 'Đỗ Môn', chart);
    html += rDo.html;
    if (pDo && pDay) {
      const relDo = getRelationBetweenPalaces(pDo, pDay, chart);
      if (relDo.rel === 'a_sinh_b') { html += note('🟢 Người đề bạt đang tích cực vận động cho bạn.', 'good'); score += 2; }
      else if (relDo.rel === 'a_khac_b') { html += note('🔴 Người đang push hồ sơ thực ra bất lợi cho bạn — cẩn thận bị đâm sau lưng.', 'bad'); score -= 2; }
    }
    if (pDo && isVoid(chart, pDo)) { html += note('⭕ Đỗ Môn Không Vong: Người đề bạt đang yếu thế hoặc không có thực quyền.', 'bad'); score -= 1; }

    // --- Thế lực cấp trên ---
    html += section('🏛️ Thế Lực Quyết Định (Trực Phù + Thái Tuế)');
    let supportScore = 0;
    if (pZF) {
      const rZF = analyzePalaceFull(pZF, 'Trực Phù (Sếp Trực Tiếp)', chart);
      html += rZF.html;
      if (pDay) {
        const rZFDay = getRelationBetweenPalaces(pZF, pDay, chart);
        if (rZFDay.rel === 'a_sinh_b') { html += note('🟢 Sếp trực tiếp ủng hộ: Yếu tố quyết định quan trọng nhất đang thuận lợi.', 'good'); supportScore += 2; }
        else if (rZFDay.rel === 'a_khac_b') { html += note('🔴 Sếp trực tiếp cản trở: Người có quyền quyết định đang không ủng hộ.', 'bad'); supportScore -= 2; }
      }
    }
    if (pThaiTue) {
      const rTT = analyzePalaceFull(pThaiTue, 'Thái Tuế (Lãnh Đạo Cao Cấp)', chart);
      html += rTT.html;
      if (pDay) {
        const rTTDay = getRelationBetweenPalaces(pThaiTue, pDay, chart);
        if (rTTDay.rel === 'a_sinh_b') { html += note('🟢 Lãnh đạo cao cấp bảo trợ: Cơ hội thăng chức gần như chắc chắn.', 'good'); supportScore += 3; }
        else if (rTTDay.rel === 'a_khac_b') { html += note('🔴 Lãnh đạo cao cấp phủ quyết: Dù sếp trực tiếp ủng hộ cũng khó thành.', 'bad'); supportScore -= 3; }
      }
    }
    if (pYear) {
      const rYear = analyzePalaceFull(pYear, `Can Năm [${yearHS}] (Quản lý)`, chart);
      html += rYear.html;
    }
    score += supportScore;
    if (supportScore >= 3) { html += verdict('✅ Hệ cấp trên đang ủng hộ mạnh mẽ — lực đẩy thăng chức lớn.', 'good'); }
    else if (supportScore <= -2) { html += verdict('❌ Hệ cấp trên đang phản đối hoặc cản trở — lực cản thăng chức lớn.', 'bad'); }

    // --- Thời điểm ---
    html += section('⏰ Thời Điểm & Kết Luận');
    if (isHorse(chart, pKhai)) { html += note('🐎 Khai Môn có Dịch Mã: Quyết định đến nhanh và bất ngờ — cơ hội có thể xuất hiện đột xuất.'); score += 1; }
    if (pKhai && hasPattern(pKhai, 'phản ngâm')) { html += note('🔄 Phản Ngâm: Có thể thăng chức rồi lại bị điều chuyển, vị trí mới không ổn định.'); score -= 1; }

    return { html, score };
  };

  // ===== CHỦ ĐỀ 4: TÌM KIẾM NGƯỜI DẪN ĐƯỜNG =====
  TOPIC_ANALYZERS[4] = function(chart) {
    let score = 0, html = '';
    const pPhu = findPalaceByStarName(chart, 'Thiên Phụ');

    html += section('🧭 Xác Định Thiên Phụ Tinh (Người Dẫn Đường)');
    if (!pPhu) {
      html += note('🔴 Thiên Phụ ẩn phục: Hiện tại chưa tìm được người dẫn đường phù hợp. Không nên vội vàng.', 'bad');
      return { html, score: -2 };
    }

    const rPhu = analyzePalaceFull(pPhu, 'Thiên Phụ', chart);
    html += rPhu.html; score += rPhu.score;

    const direction = palaceDirection(pPhu.cung, chart);
    const cungName = palaceName(pPhu.cung, chart);
    html += note(`🧭 Người dẫn đường ở hướng: ${direction} — Cung ${cungName}. Hãy tìm kiếm theo hướng này.`);

    // Đánh giá chất lượng người dẫn đường
    html += section('📊 Đánh Giá Năng Lực & Thái Độ Người Dẫn Đường');
    const deity = getEffectiveDeityName(pPhu, chart);
    const gate = pPhu.batMon || '';
    const star = pPhu.thienBan || '';

    if (deity.includes('Trực Phù')) { html += note('🟢 Trực Phù: Người dẫn đường có uy tín và thực lực cao, đáng tin cậy hoàn toàn.', 'good'); score += 2; }
    else if (deity.includes('Thái Âm')) { html += note('🟢 Thái Âm: Người dẫn đường ẩn mình, khiêm tốn nhưng cực kỳ giỏi — cần kiên nhẫn tiếp cận.', 'good'); score += 1; }
    else if (deity.includes('Lục Hợp')) { html += note('🟢 Lục Hợp: Người dẫn đường sẵn sàng hợp tác, dễ tiếp cận, có mạng lưới quan hệ rộng.', 'good'); score += 1; }
    else if (deity.includes('Cửu Thiên')) { html += note('🟢 Cửu Thiên: Người dẫn đường có tầm nhìn xa, danh tiếng lớn, kết nối tốt.', 'good'); score += 1; }
    else if (deity.includes('Huyền Vũ')) { html += note('🔴 Huyền Vũ: Cẩn thận! Người tự xưng là dẫn đường có thể không trung thực, mục đích không trong sáng.', 'bad'); score -= 2; }
    else if (deity.includes('Đằng Xà')) { html += note('🔴 Đằng Xà: Người dẫn đường nói nhiều nhưng thực lực hạn chế, dễ dẫn dắt sai hướng.', 'bad'); score -= 2; }
    else if (deity.includes('Bạch Hổ')) { html += note('⚠️ Bạch Hổ: Người dẫn đường cứng rắn, khắt khe — không dễ tiếp cận nhưng hiệu quả thực tế.'); score -= 1; }

    if (normalizeGateName(gate) === 'Sinh') { html += note('🟢 Sinh Môn: Người dẫn đường đang trong giai đoạn phát triển mạnh, nhiều sinh khí.', 'good'); score += 1; }
    else if (normalizeGateName(gate) === 'Tử') { html += note('🔴 Tử Môn: Người dẫn đường đang yếu thế, không phải thời điểm tốt để nhờ cậy.', 'bad'); score -= 2; }
    else if (normalizeGateName(gate) === 'Khai') { html += note('🟢 Khai Môn: Người dẫn đường đang rất tích cực, cởi mở, cơ hội tiếp cận cao.', 'good'); score += 2; }

    if (isVoid(chart, pPhu)) { html += note('⭕ Thiên Phụ Không Vong: Người dẫn đường vắng mặt, chỉ dẫn sai, hoặc không thực sự có thực lực như vẻ ngoài.', 'bad'); score -= 3; }
    if (hasRuMu(pPhu)) { html += note('🪦 Thiên Phụ Nhập Mộ: Người dẫn đường đang bị cô lập hoặc không tiếp xúc được vào lúc này.', 'bad'); score -= 2; }
    if (isHorse(chart, pPhu)) { html += note('🐎 Dịch Mã: Người dẫn đường đang di chuyển nhiều, khó gặp mặt — nên liên hệ trước.'); }

    // Cách tiếp cận
    html += section('💡 Gợi Ý Tiếp Cận');
    html += note(`📍 Tìm theo hướng ${direction}. Thiên Phụ đang ở Cung ${cungName} (${palaceElement(pPhu.cung, chart)}). Nếu đặt phòng họp hoặc gặp mặt, ưu tiên không gian phía ${direction}.`);

    return { html, score };
  };

  // ===== CHỦ ĐỀ 5: CHUYỂN VIỆC =====
  TOPIC_ANALYZERS[5] = function(chart) {
    let score = 0, html = '';
    const dayHS = getStemOf(chart, 'day');
    const pDay = findPalaceByHeavenlyStem(chart, dayHS);
    const pKhai = findPalaceByGate(chart, 'Khai');
    const pDo = findPalaceByGate(chart, 'Đỗ');
    const pSinh = findPalaceByGate(chart, 'Sinh');

    // --- Bản thân hiện tại ---
    html += section('🧑 Hiện Trạng Bản Thân (Can Ngày)');
    const rDay = analyzePalaceFull(pDay, `Can Ngày [${dayHS}]`, chart);
    html += rDay.html; score += rDay.score * 0.5;
    if (pDay && isVoid(chart, pDay)) { html += note('⭕ Bản thân Không Vong: Đang trong giai đoạn "trống rỗng" — thực ra là thời điểm dễ dứt bỏ cũ để đón nhận mới.'); score += 1; }

    // --- Công ty mới (Đỗ Môn) ---
    html += section('🏢 Công Ty Dự Định Chuyển Đến (Đỗ Môn)');
    const rDo = analyzePalaceFull(pDo, 'Đỗ Môn', chart);
    html += rDo.html;

    if (pDo && pDay) {
      const rel = getRelationBetweenPalaces(pDo, pDay, chart);
      html += line('Công ty mới ↔ Bản thân', rel.label, rel.rel.includes('sinh') ? 'good' : rel.rel.includes('khac') ? 'bad' : 'neutral');
      if (rel.rel === 'a_sinh_b') { html += note('🟢 Công ty mới sinh trợ bản thân: Môi trường mới cực kỳ phù hợp, phát triển nhanh, đãi ngộ tốt.', 'good'); score += 3; }
      else if (rel.rel === 'b_sinh_a') { html += note('🟡 Bản thân cống hiến nhiều cho công ty mới: Sẽ được trọng dụng nhưng phải bỏ ra nhiều.'); score += 1; }
      else if (rel.rel === 'a_khac_b') { html += note('🔴 Công ty mới khắc bản thân: Văn hóa công ty và phong cách làm việc không tương thích — nguy cơ thất bại cao.', 'bad'); score -= 3; }
      else if (rel.rel === 'b_khac_a') { html += note('🟡 Bản thân khắc công ty: Vị trí mới nhiều áp lực, nhưng có thể phát huy quyền lực cao.'); score -= 1; }
      else if (rel.rel === 'dong_hanh') { html += note('🟢 Tỷ hòa: Văn hóa công ty tương đồng — dễ hòa nhập, phát triển ổn định.', 'good'); score += 2; }
    }
    if (pDo && isVoid(chart, pDo)) { html += note('⭕ Đỗ Môn Không Vong: Công ty dự định chuyển đến chưa chắc chắn, có thể là tin đồn hoặc đề nghị ảo.', 'bad'); score -= 2; }
    if (pDo && hasRuMu(pDo)) { html += note('🪦 Đỗ Môn Nhập Mộ: Công ty mới đang có vấn đề nội bộ — hãy điều tra kỹ trước khi nhận lời.', 'bad'); score -= 2; }

    // --- Tương lai sự nghiệp sau chuyển (Khai Môn) ---
    html += section('🔮 Tương Lai Sự Nghiệp Sau Khi Chuyển (Khai Môn)');
    const rKhai = analyzePalaceFull(pKhai, 'Khai Môn', chart);
    html += rKhai.html; score += rKhai.score;

    if (pKhai && pDay) {
      const rel2 = getRelationBetweenPalaces(pKhai, pDay, chart);
      if (rel2.rel === 'a_sinh_b') { html += note('🟢 Sự nghiệp tương lai vô cùng sáng lạn sau khi chuyển việc — nên đi.', 'good'); score += 3; }
      else if (rel2.rel === 'a_khac_b') { html += note('🔴 Tương lai sự nghiệp xấu sau khi chuyển — nguy cơ thất nghiệp hoặc xuống dốc.', 'bad'); score -= 3; }
    }
    if (pKhai && isVoid(chart, pKhai)) { html += note('⭕ Khai Môn Không Vong: Sau khi nghỉ sẽ không tìm được việc tốt hơn ngay — hãy chắc chắn đã có nơi đến.', 'bad'); score -= 2; }
    if (pKhai && hasPattern(pKhai, 'phản ngâm')) { html += note('🔄 Khai Môn Phản Ngâm: Nghề nghiệp sau khi chuyển sẽ thay đổi liên tục — không ổn định ban đầu.'); }
    if (pKhai && hasPattern(pKhai, 'phục ngâm')) { html += note('⏸️ Khai Môn Phục Ngâm: Sau khi chuyển sự nghiệp vẫn giậm chân, chưa bứt phá được.'); score -= 1; }

    // --- Tài lộc ---
    html += section('💰 Tài Lộc Sau Khi Chuyển (Sinh Môn)');
    const rSinh = analyzePalaceFull(pSinh, 'Sinh Môn', chart);
    html += rSinh.html;
    if (pSinh && isVoid(chart, pSinh)) { html += note('⭕ Sinh Môn Không Vong: Thu nhập thực tế ở nơi mới thấp hơn kỳ vọng.', 'bad'); score -= 1; }
    if (pSinh && pDo && pSinh.cung === pDo.cung) { html += note('🟢 Sinh Môn đồng cung Đỗ Môn: Công ty mới chính là nơi kiếm được nhiều tiền!', 'good'); score += 2; }

    // --- Đánh giá thời điểm ---
    html += section('⏰ Lời Khuyên Thời Điểm');
    const isPhuc = hasGlobalPattern(chart, 'phục ngâm');
    const isPhan = hasGlobalPattern(chart, 'phản ngâm');
    if (isPhan) { html += note('🔄 Toàn cục Phản Ngâm: Đây là thời điểm cực kỳ thích hợp để thay đổi, dịch chuyển.', 'good'); score += 2; }
    if (isPhuc) { html += note('⏸️ Toàn cục Phục Ngâm: Chưa nên chuyển lúc này — mọi thứ đang trì trệ, dời lại sẽ tốt hơn.', 'bad'); score -= 2; }

    return { html, score };
  };

  // ===== CHỦ ĐỀ 6: XIN VIỆC =====
  TOPIC_ANALYZERS[6] = function(chart) {
    let score = 0, html = '';
    const dayHS = getStemOf(chart, 'day');
    const pDay = findPalaceByHeavenlyStem(chart, dayHS);
    const pKhai = findPalaceByGate(chart, 'Khai');
    const pDo = findPalaceByGate(chart, 'Đỗ');
    const pSinh = findPalaceByGate(chart, 'Sinh');
    const pZF = getZhifuPalace(chart);

    // --- Bản thân ứng viên ---
    html += section('👤 Ứng Viên (Can Ngày)');
    const rDay = analyzePalaceFull(pDay, `Can Ngày [${dayHS}]`, chart);
    html += rDay.html; score += rDay.score;

    // --- Buổi phỏng vấn (Đỗ Môn) ---
    html += section('🎙️ Buổi Phỏng Vấn (Đỗ Môn)');
    const rDo = analyzePalaceFull(pDo, 'Đỗ Môn', chart);
    html += rDo.html;
    if (pDo && pDay) {
      const rel = getRelationBetweenPalaces(pDo, pDay, chart);
      if (rel.rel === 'a_sinh_b') { html += note('🟢 Buổi phỏng vấn sinh bản thân: Phỏng vấn diễn ra suôn sẻ, nhà tuyển dụng rất ấn tượng.', 'good'); score += 2; }
      else if (rel.rel === 'a_khac_b') { html += note('🔴 Buổi phỏng vấn gây áp lực lớn: Câu hỏi khó, tình huống không thuận lợi — cần chuẩn bị rất kỹ.', 'bad'); score -= 2; }
    }
    if (pDo && isVoid(chart, pDo)) { html += note('⭕ Đỗ Môn Không Vong: Buổi phỏng vấn có thể bị dời lịch, hủy, hoặc diễn ra không thực chất.', 'bad'); score -= 1; }
    if (pDo && hasPattern(pDo, 'phục ngâm')) { html += note('⏸️ Phục Ngâm: Phỏng vấn nhiều vòng, quá trình xét tuyển kéo dài.'); score -= 1; }

    // --- Kết quả cuối cùng (Khai Môn) ---
    html += section('📣 Kết Quả Tuyển Dụng (Khai Môn)');
    const rKhai = analyzePalaceFull(pKhai, 'Khai Môn (Quyết định)', chart);
    html += rKhai.html;

    if (pKhai && pDay) {
      const rel = getRelationBetweenPalaces(pKhai, pDay, chart);
      if (rel.rel === 'a_sinh_b') { html += note('✅ Khai Môn sinh bản thân: ĐẬU — Công ty chủ động và nhiệt tình mời nhận. Rất cát.', 'good'); score += 4; }
      else if (rel.rel === 'b_sinh_a') { html += note('🟡 Bản thân sinh Khai Môn: Cơ hội có nhưng cần thêm nỗ lực thuyết phục — có thể đậu vòng sau.'); score += 1; }
      else if (rel.rel === 'a_khac_b') { html += note('❌ Khai Môn khắc bản thân: RỚT — Yêu cầu vị trí không phù hợp hoặc đã chọn ứng viên khác.', 'bad'); score -= 4; }
      else if (rel.rel === 'b_khac_a') { html += note('🟡 Bản thân khắc Khai Môn: Bạn đủ điều kiện nhưng vị trí tuyển dụng có giới hạn — phụ thuộc vào cạnh tranh với ứng viên khác.'); score -= 1; }
      else if (rel.rel === 'dong_hanh') { html += note('🟢 Tỷ hòa: Tương đồng với yêu cầu vị trí — cơ hội 60-70%.', 'good'); score += 1; }
    }
    if (pKhai && isVoid(chart, pKhai)) { html += note('⭕ Khai Môn Không Vong: Chưa có kết quả thực sự, cần chờ thêm — vị trí tuyển dụng có thể bị hủy.', 'bad'); score -= 2; }
    if (pKhai && hasRuMu(pKhai)) { html += note('🪦 Khai Môn Nhập Mộ: Kết quả bị treo, thông báo trễ, hoặc quá trình bị kẹt ở khâu phê duyệt.', 'bad'); score -= 1; }

    // --- Sếp tương lai (Trực Phù) ---
    html += section('👔 Sếp Tương Lai (Trực Phù)');
    if (pZF) {
      const rZF = analyzePalaceFull(pZF, 'Trực Phù (Người quản lý)', chart);
      html += rZF.html;
      if (pDay) {
        const relZF = getRelationBetweenPalaces(pZF, pDay, chart);
        if (relZF.rel === 'a_sinh_b') { html += note('🟢 Sếp tương lai sẽ nâng đỡ và tạo điều kiện tốt cho bạn.', 'good'); score += 2; }
        else if (relZF.rel === 'a_khac_b') { html += note('🔴 Sếp tương lai có tính cách áp chế — khó làm việc chung lâu dài.', 'bad'); score -= 1; }
      }
    }

    // --- Lương thưởng ---
    html += section('💰 Kỳ Vọng Lương Thưởng (Sinh Môn)');
    if (pSinh) {
      const rSinh = analyzePalaceFull(pSinh, 'Sinh Môn', chart);
      html += rSinh.html;
      if (isVoid(chart, pSinh)) { html += note('⭕ Sinh Môn Không Vong: Mức lương thực tế thấp hơn con số được chào — đàm phán kỹ.', 'bad'); score -= 1; }
    }

    return { html, score };
  };

  // ===== CHỦ ĐỀ 7: MUA HÀNG =====
  TOPIC_ANALYZERS[7] = function(chart) {
    let score = 0, html = '';
    const dayHS = getStemOf(chart, 'day');
    const hourHS = getStemOf(chart, 'hour');
    const pDay = findPalaceByHeavenlyStem(chart, dayHS);
    const pHour = findPalaceByHeavenlyStem(chart, hourHS);
    const pCanh = findPalaceByGate(chart, 'Cảnh');

    // --- Người mua ---
    html += section('🛒 Người Mua (Can Ngày)');
    const rDay = analyzePalaceFull(pDay, `Người mua [${dayHS}]`, chart);
    html += rDay.html;

    // --- Sản phẩm ---
    html += section('📦 Sản Phẩm / Dịch Vụ (Can Giờ)');
    const rHour = analyzePalaceFull(pHour, `Sản phẩm [${hourHS}]`, chart);
    html += rHour.html; score += rHour.score;

    if (pHour && isVoid(chart, pHour)) { html += note('⭕ Sản phẩm Không Vong: Hàng hóa không thực chất, mua về không đáp ứng được nhu cầu thực sự.', 'bad'); score -= 3; }
    if (pHour && hasRuMu(pHour)) { html += note('🪦 Sản phẩm Nhập Mộ: Chất lượng ẩn khuất, cần kiểm tra kỹ trước khi quyết định.', 'bad'); score -= 2; }

    // --- Quan hệ người mua và sản phẩm ---
    html += section('⚖️ Mức Phù Hợp: Người Mua ↔ Sản Phẩm');
    if (pDay && pHour) {
      const relDayHour = getRelationBetweenStems(hourHS, dayHS);
      html += line('Sản phẩm ↔ Người mua', relDayHour.label, relDayHour.rel.includes('sinh') ? 'good' : relDayHour.rel.includes('khac') ? 'bad' : 'neutral');

      if (relDayHour.rel === 'a_sinh_b') {
        html += note('🟢 Sản phẩm sinh người mua: Hàng hóa cực kỳ phù hợp, đáp ứng đúng nhu cầu. NÊN MUA.', 'good'); score += 3;
      } else if (relDayHour.rel === 'b_sinh_a') {
        html += note('🟡 Người mua thích sản phẩm (one-sided): Bạn muốn mua nhưng hàng chưa thực sự tốt cho bạn — cân nhắc thêm.'); score += 1;
      } else if (relDayHour.rel === 'a_khac_b') {
        html += note('🔴 Sản phẩm khắc người mua: Hàng kém chất lượng hoặc không phù hợp — KHÔNG NÊN MUA.', 'bad'); score -= 3;
      } else if (relDayHour.rel === 'b_khac_a') {
        html += note('🟡 Người mua khắc sản phẩm: Mua rồi sẽ nhàm chán nhanh, thị trường bão hòa sớm, cần đổi sản phẩm.'); score -= 1;
      } else if (relDayHour.rel === 'dong_hanh') {
        html += note('🟡 Tỷ hòa: Sản phẩm và người mua cùng ngũ hành — phù hợp nhưng không có sự đột phá đặc biệt.'); score += 1;
      }

      // Cùng cung
      if (pDay.cung === pHour.cung) {
        html += note('🟢 Người mua và sản phẩm đồng cung: Sự kết hợp hoàn hảo — giao dịch diễn ra nhanh chóng, không do dự.', 'good'); score += 2;
      }
    }

    // --- Thị trường (Cảnh Môn) ---
    html += section('🌐 Thị Trường (Cảnh Môn)');
    const rCanh = analyzePalaceFull(pCanh, 'Cảnh Môn (Thị trường)', chart);
    html += rCanh.html;
    if (pCanh && isVoid(chart, pCanh)) {
      html += note('⭕ Cảnh Môn Không Vong: Thị trường ảo, giá bị thổi phồng — nguy cơ mua hớ giá cao. Hãy so sánh nhiều nơi.', 'bad'); score -= 2;
    }
    if (pCanh && pHour && pCanh.cung === pHour.cung) {
      html += note('🟡 Sản phẩm đồng cung Cảnh Môn: Đây là hàng thuộc phân khúc cao cấp/trưng bày — chú ý phân biệt thực chất và hình thức.'); score += 1;
    }

    // --- Thần hỗ trợ ---
    html += section('🔍 Chỉ Dấu Đặc Biệt');
    const deityHour = pHour ? getEffectiveDeityName(pHour, chart) : '';
    if (deityHour.includes('Huyền Vũ')) { html += note('🔴 Huyền Vũ nơi sản phẩm: Nguy cơ hàng giả, hàng nhái, hoặc lừa đảo thương mại.', 'bad'); score -= 3; }
    if (deityHour.includes('Đằng Xà')) { html += note('🔴 Đằng Xà: Quảng cáo sai sự thật, chất lượng thực tế thấp hơn mô tả nhiều.', 'bad'); score -= 2; }
    if (deityHour.includes('Lục Hợp')) { html += note('🟢 Lục Hợp: Sản phẩm có nhiều đánh giá tốt, được cộng đồng ủng hộ rộng rãi.', 'good'); score += 1; }
    if (deityHour.includes('Thái Âm')) { html += note('🟢 Thái Âm: Sản phẩm có chất lượng thực sự nhưng chưa được biết đến nhiều — hàng tốt chưa nổi.', 'good'); score += 1; }

    return { html, score };
  };

  // ===== CHỦ ĐỀ 8: BÁN HÀNG =====
  TOPIC_ANALYZERS[8] = function(chart) {
    let score = 0, html = '';
    const dayHS = getStemOf(chart, 'day');
    const hourHS = getStemOf(chart, 'hour');
    const pDay = findPalaceByHeavenlyStem(chart, dayHS);
    const pHour = findPalaceByHeavenlyStem(chart, hourHS);
    const pSinh = findPalaceByGate(chart, 'Sinh');
    const pTS = getZhishiPalace(chart);
    const pMau = findPalaceByHeavenlyStem(chart, 'Mậu');

    // --- Người bán ---
    html += section('🧑‍💼 Người Bán (Can Ngày)');
    const rDay = analyzePalaceFull(pDay, `Người bán [${dayHS}]`, chart);
    html += rDay.html; score += rDay.score * 0.5;

    // --- Sản phẩm ---
    html += section('📦 Sản Phẩm / Dịch Vụ (Can Giờ)');
    const rHour = analyzePalaceFull(pHour, `Sản phẩm [${hourHS}]`, chart);
    html += rHour.html; score += rHour.score;

    if (pHour && isVoid(chart, pHour)) { html += note('⭕ Sản phẩm Không Vong: Hàng hóa không đủ sức hấp dẫn thực sự, khó chốt sale.', 'bad'); score -= 2; }

    // Sản phẩm vs Người bán
    if (pDay && pHour) {
      const relDP = getRelationBetweenStems(hourHS, dayHS);
      if (relDP.rel === 'a_khac_b') { html += note('🔴 Sản phẩm "không đi với" người bán: Bạn không phải chuyên gia lĩnh vực này, khó tạo niềm tin với khách.', 'bad'); score -= 2; }
      else if (relDP.rel === 'a_sinh_b') { html += note('🟢 Sản phẩm tốt cho người bán: Đây là lĩnh vực sở trường, bán dễ dàng và tự nhiên.', 'good'); score += 2; }
    }

    // --- Khách hàng (Trực Sử) ---
    html += section('🤝 Khách Hàng (Trực Sử)');
    const rTS = analyzePalaceFull(pTS, 'Trực Sử (Khách hàng)', chart);
    html += rTS.html;

    if (pHour && pTS) {
      const relProdCust = getRelationBetweenPalaces(pHour, pTS, chart);
      html += line('Sản phẩm ↔ Khách hàng', relProdCust.label, relProdCust.rel.includes('sinh') ? 'good' : relProdCust.rel.includes('khac') ? 'bad' : 'neutral');
      if (relProdCust.rel === 'a_sinh_b') { html += note('🟢 Sản phẩm sinh khách: Khách hàng thực sự cần và yêu thích sản phẩm — dễ chốt sale.', 'good'); score += 3; }
      else if (relProdCust.rel === 'b_sinh_a') { html += note('🟡 Khách hàng đang "nuôi" sản phẩm: Mua vì trung thành chứ chưa chắc vì nhu cầu thực — nguy cơ mất khách khi có đối thủ.'); score += 1; }
      else if (relProdCust.rel === 'a_khac_b') { html += note('🔴 Sản phẩm áp lực lên khách: Khách hàng cảm thấy bị ép buộc — tỷ lệ hoàn trả/khiếu nại cao.', 'bad'); score -= 2; }
      else if (relProdCust.rel === 'b_khac_a') { html += note('🟡 Khách hàng "khắt khe" với sản phẩm: Hay đòi hỏi, so sánh, khó chốt nhưng nếu chốt được rất trung thành.'); score -= 1; }
    }
    if (pDay && pTS) {
      const relSeller = getRelationBetweenPalaces(pDay, pTS, chart);
      if (relSeller.rel === 'a_sinh_b') { html += note('🟡 Người bán sinh khách: Bạn phục vụ khách quá tốt nhưng phụ thuộc nhiều vào khách — khách bỏ là mất nguồn thu.'); score -= 1; }
      else if (relSeller.rel === 'a_khac_b') { html += note('⚠️ Người bán khắc khách: Dễ xảy ra tranh chấp, khiếu nại, mâu thuẫn với khách hàng.', 'bad'); score -= 2; }
    }
    if (pTS && isVoid(chart, pTS)) { html += note('⭕ Trực Sử Không Vong: Khách hàng tiềm năng không thực chất, dễ hủy đơn hoặc không chốt.', 'bad'); score -= 2; }

    // --- Lợi nhuận ---
    html += section('💵 Lợi Nhuận (Sinh Môn)');
    const rSinh = analyzePalaceFull(pSinh, 'Sinh Môn (Lợi nhuận)', chart);
    html += rSinh.html; score += rSinh.score;

    if (pHour && pSinh) {
      const relProfit = getRelationBetweenPalaces(pHour, pSinh, chart);
      if (relProfit.rel === 'a_sinh_b') { html += note('🟢 Sản phẩm sinh lợi nhuận: Biên lợi nhuận cao, kinh doanh rất có lãi.', 'good'); score += 3; }
      else if (relProfit.rel === 'a_khac_b') { html += note('🔴 Sản phẩm bào mòn lợi nhuận: Chi phí sản xuất/phân phối quá cao, bán nhiều nhưng lãi ít.', 'bad'); score -= 3; }
    }
    if (pSinh && isVoid(chart, pSinh)) { html += note('⭕ Sinh Môn Không Vong: Lợi nhuận hư ảo — doanh thu cao nhưng thực thu về tay thấp.', 'bad'); score -= 2; }

    // --- Vốn ---
    html += section('🏦 Vốn Liếng (Mậu)');
    if (pMau) {
      const rMau = analyzePalaceFull(pMau, 'Mậu (Vốn)', chart);
      html += rMau.html;
      if (hasRuMu(pMau)) { html += note('🪦 Vốn Nhập Mộ: Tiền bị chôn cứng, không xoay vòng được — nguy cơ thiếu thanh khoản.', 'bad'); score -= 2; }
      if (isVoid(chart, pMau)) { html += note('⭕ Vốn Không Vong: Thiếu vốn thực chất, tài chính không vững chắc.', 'bad'); score -= 2; }
    }

    return { html, score };
  };

  // ===== CHỦ ĐỀ 9: MỞ KINH DOANH =====
  TOPIC_ANALYZERS[9] = function(chart) {
    let score = 0, html = '';
    const dayHS = getStemOf(chart, 'day');
    const pDay = findPalaceByHeavenlyStem(chart, dayHS);
    const pKhai = findPalaceByGate(chart, 'Khai');
    const pSinh = findPalaceByGate(chart, 'Sinh');
    const pMau = findPalaceByHeavenlyStem(chart, 'Mậu');

    // --- Bản thân ---
    html += section('🧑 Chủ Doanh Nghiệp (Can Ngày)');
    const rDay = analyzePalaceFull(pDay, `Can Ngày [${dayHS}]`, chart);
    html += rDay.html; score += rDay.score;

    // --- Khai Môn - Trọng tâm ---
    html += section('🚀 Cửa Khởi Sự (Khai Môn) — TRỌNG TÂM');
    if (!pKhai) {
      html += note('🔴 Khai Môn ẩn phục hoàn toàn: Thời cơ chưa đến — chưa nên mở kinh doanh lúc này.', 'bad');
      return { html, score: -4 };
    }
    const rKhai = analyzePalaceFull(pKhai, 'Khai Môn', chart);
    html += rKhai.html; score += rKhai.score;

    if (isVoid(chart, pKhai)) { html += note('⭕ Khai Môn Tuần Không: Kế hoạch kinh doanh đổ vỡ, vốn hao tổn, không nên khởi sự thời điểm này.', 'bad'); score -= 4; }
    if (hasRuMu(pKhai)) { html += note('🪦 Khai Môn Nhập Mộ: Kinh doanh sẽ bế tắc ngay từ đầu, khách hàng không đến. KHÔNG NÊN MỞ.', 'bad'); score -= 3; }
    if (pKhai && hasPattern(pKhai, 'phục ngâm')) { html += note('⏸️ Khai Môn Phục Ngâm: Kinh doanh đình đốn kéo dài, doanh thu lẹt đẹt — chọn thời điểm khác.', 'bad'); score -= 2; }

    // Quan hệ Khai Môn với bản thân
    if (pDay) {
      const rel = getRelationBetweenPalaces(pKhai, pDay, chart);
      if (rel.rel === 'a_sinh_b') { html += note('🟢 Khai Môn sinh bản thân: Nghề nghiệp này cực kỳ phù hợp — sẽ phát tài.', 'good'); score += 3; }
      else if (rel.rel === 'a_khac_b') { html += note('🔴 Khai Môn khắc bản thân: Ngành nghề này không phù hợp với bạn — dễ thất bại.', 'bad'); score -= 3; }
    }

    // --- Bát Thần đi cùng Khai Môn ---
    html += section('👥 Thần Khí Hỗ Trợ (Bát Thần tại Khai Môn)');
    const deity = getEffectiveDeityName(pKhai, chart);
    const deityImpact = {
      'Trực Phù': { msg: '🟢 Trực Phù: Có quý nhân đỡ đầu lớn, được hỗ trợ từ người có quyền lực.', type: 'good', sc: 3 },
      'Thái Âm': { msg: '🟢 Thái Âm: Khách hàng trung thành, quay lại nhiều lần, thích hợp kinh doanh dịch vụ B2C.', type: 'good', sc: 2 },
      'Lục Hợp': { msg: '🟢 Lục Hợp: Hợp tác nhiều, đối tác tốt, phù hợp kinh doanh liên kết/nhượng quyền.', type: 'good', sc: 2 },
      'Cửu Thiên': { msg: '🟢 Cửu Thiên: Danh tiếng lan xa, thương hiệu mạnh, bán hàng online/toàn quốc tốt.', type: 'good', sc: 2 },
      'Cửu Địa': { msg: '🟡 Cửu Địa: Phát triển chậm nhưng bền vững, phù hợp kinh doanh truyền thống.', type: 'neutral', sc: 0 },
      'Đằng Xà': { msg: '🔴 Đằng Xà: Dễ dính pháp lý, thuế vụ, tranh chấp hợp đồng — cẩn thận giấy tờ pháp lý.', type: 'bad', sc: -3 },
      'Bạch Hổ': { msg: '🔴 Bạch Hổ: Bế tắc liên tục, nhân viên tranh chấp, mệt mỏi không ngừng.', type: 'bad', sc: -2 },
      'Huyền Vũ': { msg: '🔴 Huyền Vũ: Thất thoát tài chính, nhân viên trộm cắp, đối tác không trung thực.', type: 'bad', sc: -3 },
      'Câu Trần': { msg: '🔴 Câu Trần: Ứ đọng, hàng tồn kho lớn, không thanh lý được.', type: 'bad', sc: -2 },
      'Chu Tước': { msg: '🔴 Chu Tước: Cãi vã với đối tác/khách hàng, tiếng xấu lan ra nhanh.', type: 'bad', sc: -2 }
    };
    let deityFound = false;
    for (const [k, v] of Object.entries(deityImpact)) {
      if (deity && deity.includes(k)) {
        html += note(v.msg, v.type); score += v.sc; deityFound = true; break;
      }
    }
    if (!deityFound && deity) html += line('Bát Thần tại Khai Môn', deity, 'neutral');

    // --- Lợi nhuận ---
    html += section('💰 Tiềm Năng Lợi Nhuận (Sinh Môn)');
    const rSinh = analyzePalaceFull(pSinh, 'Sinh Môn', chart);
    html += rSinh.html; score += rSinh.score * 0.5;
    if (pSinh && pKhai && pSinh.cung === pKhai.cung) { html += note('🟢 Sinh Môn và Khai Môn đồng cung: Kinh doanh và lợi nhuận nhất quán — đây là quẻ rất cát để mở shop!', 'good'); score += 3; }
    if (pSinh && isVoid(chart, pSinh)) { html += note('⭕ Sinh Môn Không Vong: Kinh doanh có nhưng lợi nhuận thực thu về ít hơn mong đợi.', 'bad'); score -= 2; }

    // --- Vốn ---
    html += section('🏦 Vốn Khởi Sự (Mậu)');
    if (pMau) {
      const rMau = analyzePalaceFull(pMau, 'Mậu (Vốn đầu tư)', chart);
      html += rMau.html;
      if (hasRuMu(pMau)) { html += note('🪦 Vốn Nhập Mộ: Vốn chôn cứng, không xoay vòng được — nguy cơ hết tiền mặt.', 'bad'); score -= 2; }
      if (isVoid(chart, pMau)) { html += note('⭕ Vốn Không Vong: Vốn thực tế thấp hơn dự kiến — hãy đảm bảo nguồn vốn trước khi bắt đầu.', 'bad'); score -= 2; }
    }

    // --- Cục tổng thể ---
    const isPhuc = hasGlobalPattern(chart, 'phục ngâm');
    const isPhan = hasGlobalPattern(chart, 'phản ngâm');
    if (isPhuc) { html += note('⏸️ Toàn cục Phục Ngâm: Môi trường kinh doanh đang trì trệ — hãy đợi thời điểm khác.', 'bad'); score -= 2; }
    if (isPhan) { html += note('🔄 Toàn cục Phản Ngâm: Thị trường đang có sự dịch chuyển lớn — cơ hội cho người nhanh nắm bắt.', 'good'); score += 1; }

    return { html, score };
  };

  // ===== CHỦ ĐỀ 10: HỢP TÁC =====
  TOPIC_ANALYZERS[10] = function(chart) {
    let score = 0, html = '';
    const dayHS = getStemOf(chart, 'day');
    const hourHS = getStemOf(chart, 'hour');
    const pDay = findPalaceByHeavenlyStem(chart, dayHS);
    const pHour = findPalaceByHeavenlyStem(chart, hourHS);
    const pLH = findPalaceByDeityName(chart, 'Lục Hợp');
    const pSinh = findPalaceByGate(chart, 'Sinh');

    // --- Bản thân ---
    html += section('🧑 Bản Thân (Can Ngày)');
    const rDay = analyzePalaceFull(pDay, `Can Ngày [${dayHS}]`, chart);
    html += rDay.html; score += rDay.score * 0.5;

    // --- Đối tác ---
    html += section('🤝 Đối Tác (Can Giờ)');
    const rHour = analyzePalaceFull(pHour, `Đối tác [${hourHS}]`, chart);
    html += rHour.html; score += rHour.score * 0.5;
    if (pHour && isVoid(chart, pHour)) { html += note('⭕ Đối tác Không Vong: Đối tác không thực chất, thiếu năng lực hoặc nguồn lực hư ảo.', 'bad'); score -= 2; }
    if (pHour && hasRuMu(pHour)) { html += note('🪦 Đối tác Nhập Mộ: Đối tác đang trong vòng phong tỏa, gặp khó khăn nghiêm trọng — cẩn thận.', 'bad'); score -= 2; }

    // --- Quan hệ hai bên ---
    html += section('⚖️ Tương Tác Hai Bên');
    if (pDay && pHour) {
      const relAB = getRelationBetweenStems(dayHS, hourHS);
      html += line('Bản thân ↔ Đối tác', relAB.label, relAB.rel.includes('sinh') ? 'good' : relAB.rel.includes('khac') ? 'bad' : 'neutral');
      if (relAB.rel === 'dong_hanh') {
        html += note('🟢 Tỷ hòa: Hai bên cùng ngũ hành — tư duy và phong cách tương đồng, hợp tác dễ dàng.', 'good'); score += 2;
      } else if (relAB.rel === 'a_sinh_b') {
        html += note('🟢 Bản thân sinh đối tác: Bạn là người tạo động lực, đối tác nhận hỗ trợ từ bạn nhiều hơn.', 'good'); score += 2;
      } else if (relAB.rel === 'b_sinh_a') {
        html += note('🟢 Đối tác sinh bản thân: Đối tác hỗ trợ bạn nhiều — quan hệ lợi thế cho bạn.', 'good'); score += 2;
      } else if (relAB.rel === 'a_khac_b') {
        html += note('🔴 Bản thân khắc đối tác: Hai bên bất đồng lợi ích, dễ xảy ra tranh chấp nghiêm trọng.', 'bad'); score -= 3;
      } else if (relAB.rel === 'b_khac_a') {
        html += note('🔴 Đối tác khắc bản thân: Đối tác dễ chiếm đoạt lợi nhuận hoặc gây thiệt hại cho bạn.', 'bad'); score -= 3;
      }

      // Đồng cung
      if (pDay.cung === pHour.cung) {
        html += note('🟢 Hai bên đồng cung: Cực kỳ gắn kết, hợp tác chặt chẽ, quyền lợi đan xen — như "cổ đông ruột".', 'good'); score += 3;
      }
    }

    // --- Lục Hợp (Sợi dây liên kết) ---
    html += section('🔗 Sợi Dây Hợp Đồng (Lục Hợp)');
    const rLH = analyzePalaceFull(pLH, 'Lục Hợp', chart);
    html += rLH.html;
    if (pLH && isVoid(chart, pLH)) { html += note('⭕ Lục Hợp Không Vong: Hợp đồng ảo, đối tác dễ bỏ ngang, cam kết không được giữ.', 'bad'); score -= 3; }
    if (pLH && hasRuMu(pLH)) { html += note('🪦 Lục Hợp Nhập Mộ: Hợp đồng bị treo, thỏa thuận bị phong tỏa, ký kết bị trì hoãn.', 'bad'); score -= 2; }
    if (pLH) {
      const deity = getEffectiveDeityName(pLH, chart);
      if (deity.includes('Huyền Vũ')) { html += note('🔴 Lục Hợp + Huyền Vũ: Hợp tác che giấu thực chất, có gian lận trong thỏa thuận.', 'bad'); score -= 3; }
      if (deity.includes('Đằng Xà')) { html += note('🔴 Lục Hợp + Đằng Xà: Hợp đồng có điều khoản bẫy, đọc kỹ trước khi ký.', 'bad'); score -= 2; }
    }

    // --- Lợi ích tài chính ---
    html += section('💰 Lợi Ích Tài Chính (Sinh Môn)');
    const rSinh = analyzePalaceFull(pSinh, 'Sinh Môn', chart);
    html += rSinh.html; score += rSinh.score * 0.5;
    if (pSinh && pLH && pSinh.cung === pLH.cung) { html += note('🟢 Lục Hợp và Sinh Môn đồng cung: Hợp tác trực tiếp tạo ra lợi nhuận — mối quan hệ win-win rõ ràng.', 'good'); score += 2; }
    if (pSinh && isVoid(chart, pSinh)) { html += note('⭕ Sinh Môn Không Vong: Lợi ích tài chính từ hợp tác thấp hơn kỳ vọng.', 'bad'); score -= 2; }

    // --- Cách cục hợp tác ---
    const deityDay = pDay ? getEffectiveDeityName(pDay, chart) : '';
    const deityHour = pHour ? getEffectiveDeityName(pHour, chart) : '';
    if (deityDay.includes('Huyền Vũ') || deityHour.includes('Huyền Vũ')) { html += note('🔴 Một trong hai bên có Huyền Vũ: Có bên đang không trung thực về nguồn lực hoặc ý định.', 'bad'); score -= 2; }
    if (deityDay.includes('Trực Phù') || deityHour.includes('Trực Phù')) { html += note('🟢 Một bên có Trực Phù: Hợp tác có sự hỗ trợ từ người có quyền lực hoặc thương hiệu lớn.', 'good'); score += 2; }

    return { html, score };
  };

  // ===== CHỦ ĐỀ 11: MUA BÁN BĐS =====
  TOPIC_ANALYZERS[11] = function(chart) {
    let score = 0, html = '';
    const dayHS = getStemOf(chart, 'day');
    const pDay = findPalaceByHeavenlyStem(chart, dayHS);
    const pSinh = findPalaceByGate(chart, 'Sinh');
    const pTu = findPalaceByGate(chart, 'Tu') || findPalaceByGate(chart, 'Tử');
    const pCanh = findPalaceByGate(chart, 'Cảnh');
    const pMau = findPalaceByHeavenlyStem(chart, 'Mậu');
    const pTam = findPalaceByStarName(chart, 'Thiên Tâm');
    const pLH = findPalaceByDeityName(chart, 'Lục Hợp');
    const pCuuDia = findPalaceByDeityName(chart, 'Cửu Địa');
    const pCuuThien = findPalaceByDeityName(chart, 'Cửu Thiên');

    // --- Bản thân ---
    html += section('🧑 Chủ Thể Giao Dịch (Can Ngày)');
    const rDay = analyzePalaceFull(pDay, `Can Ngày [${dayHS}]`, chart);
    html += rDay.html; score += rDay.score;

    // --- Nhà ở ---
    html += section('🏠 Nhà Ở (Sinh Môn)');
    const rSinh = analyzePalaceFull(pSinh, 'Sinh Môn (Nhà)', chart);
    html += rSinh.html;
    if (pSinh && pDay) {
      const rel = getRelationBetweenPalaces(pSinh, pDay, chart);
      if (rel.rel === 'a_sinh_b') { html += note('🟢 Nhà này sinh bản thân: Căn nhà mang lại năng lượng tốt, sức khỏe và tài lộc sau khi mua.', 'good'); score += 3; }
      else if (rel.rel === 'a_khac_b') { html += note('🔴 Nhà này khắc bản thân: Phong thủy không hợp người mua — có thể gây sức khỏe hoặc tài lộc sa sút.', 'bad'); score -= 3; }
    }
    if (pSinh && isVoid(chart, pSinh)) { html += note('⭕ Sinh Môn Không Vong: Nhà không có thực hoặc giao dịch mua nhà bị hủy.', 'bad'); score -= 2; }

    // --- Đất đai ---
    html += section('🌍 Đất Đai (Tử Môn)');
    const rTu = analyzePalaceFull(pTu, 'Tử Môn (Đất)', chart);
    html += rTu.html;
    if (pTu && pDay) {
      const rel = getRelationBetweenPalaces(pTu, pDay, chart);
      if (rel.rel === 'a_sinh_b') { html += note('🟢 Đất sinh bản thân: Lô đất này sẽ mang lại lợi nhuận và phù hợp phong thủy.', 'good'); score += 2; }
      else if (rel.rel === 'a_khac_b') { html += note('🔴 Đất khắc bản thân: Đất này không hợp với người mua — có thể gặp tranh chấp hoặc thất lợi.', 'bad'); score -= 2; }
    }
    if (pTu && isVoid(chart, pTu)) { html += note('⭕ Tử Môn Không Vong: Đất không có sổ đỏ/pháp lý rõ ràng, hoặc đang trong vùng quy hoạch.', 'bad'); score -= 2; }

    // --- Chung cư (Cửu Thiên) ---
    if (pCuuThien) {
      html += section('🏢 Chung Cư / Căn Hộ (Cửu Thiên)');
      const rCT = analyzePalaceFull(pCuuThien, 'Cửu Thiên', chart);
      html += rCT.html;
      if (pCuuThien && pDay) {
        const rel = getRelationBetweenPalaces(pCuuThien, pDay, chart);
        if (rel.rel === 'a_sinh_b') { html += note('🟢 Chung cư sinh bản thân: Căn hộ phù hợp, giá trị tăng trưởng tốt.', 'good'); score += 2; }
        else if (rel.rel === 'a_khac_b') { html += note('🔴 Chung cư khắc bản thân: Không nên chọn tòa nhà này.', 'bad'); score -= 2; }
      }
    }

    // --- Dự án lớn (Cửu Địa) ---
    if (pCuuDia) {
      html += section('🏗️ Dự Án Lớn / Khu Đô Thị (Cửu Địa)');
      const rCD = analyzePalaceFull(pCuuDia, 'Cửu Địa', chart);
      html += rCD.html;
      if (isVoid(chart, pCuuDia)) { html += note('⭕ Cửu Địa Không Vong: Dự án tiến độ chậm, pháp lý chưa rõ, tiềm ẩn rủi ro.', 'bad'); score -= 2; }
    }

    // --- Pháp lý ---
    html += section('📄 Pháp Lý & Sổ Đỏ (Cảnh Môn)');
    const rCanhPl = analyzePalaceFull(pCanh, 'Cảnh Môn (Pháp lý)', chart);
    html += rCanhPl.html;
    if (pCanh && isVoid(chart, pCanh)) { html += note('⭕ Cảnh Môn Không Vong: NGUY HIỂM — Giấy tờ pháp lý không đầy đủ hoặc giả mạo. Tuyệt đối không ký kết!', 'bad'); score -= 4; }
    if (pCanh && hasRuMu(pCanh)) { html += note('🪦 Cảnh Môn Nhập Mộ: Sổ đỏ đang bị thế chấp hoặc tranh chấp chưa giải quyết.', 'bad'); score -= 3; }
    if (pCanh) {
      const dCanh = getEffectiveDeityName(pCanh, chart);
      if (dCanh.includes('Huyền Vũ') || dCanh.includes('Đằng Xà')) { html += note('🔴 Pháp lý + Huyền Vũ/Đằng Xà: Có dấu hiệu lừa đảo bất động sản — tra cứu tư pháp kỹ lưỡng!', 'bad'); score -= 3; }
    }

    // --- Vốn ---
    html += section('🏦 Năng Lực Tài Chính (Mậu + Thiên Tâm)');
    if (pMau) {
      const rMau = analyzePalaceFull(pMau, 'Mậu (Vốn)', chart);
      html += rMau.html;
      if (hasRuMu(pMau)) { html += note('🪦 Vốn Nhập Mộ: Tài chính bị phong tỏa, vay vốn khó khăn.', 'bad'); score -= 2; }
      if (isVoid(chart, pMau)) { html += note('⭕ Vốn Không Vong: Nguồn vốn không ổn định, cần đảm bảo tài chính trước.', 'bad'); score -= 2; }
    }
    if (pTam) {
      const rTam = analyzePalaceFull(pTam, 'Thiên Tâm (Tình hình tài chính)', chart);
      html += rTam.html;
    }

    // --- Môi giới ---
    html += section('🤝 Môi Giới (Lục Hợp)');
    if (pLH) {
      const rLH = analyzePalaceFull(pLH, 'Lục Hợp (Môi giới)', chart);
      html += rLH.html;
      const dLH = getEffectiveDeityName(pLH, chart);
      if (isVoid(chart, pLH)) { html += note('⭕ Lục Hợp Không Vong: Môi giới không đáng tin cậy, thông tin từ họ không chính xác.', 'bad'); score -= 1; }
      if (dLH.includes('Huyền Vũ')) { html += note('🔴 Môi giới + Huyền Vũ: Cẩn thận bị dụ dỗ bởi môi giới không chính trực.', 'bad'); score -= 2; }
    }

    return { html, score };
  };

  // ===== CHỦ ĐỀ 12: ĐI VAY / CHO VAY =====
  TOPIC_ANALYZERS[12] = function(chart) {
    let score = 0, html = '';
    const dayHS = getStemOf(chart, 'day');
    const pDay = findPalaceByHeavenlyStem(chart, dayHS);
    const pZF = getZhifuPalace(chart);
    const pTS = getZhishiPalace(chart);
    const pSinh = findPalaceByGate(chart, 'Sinh');
    const pMau = findPalaceByHeavenlyStem(chart, 'Mậu');

    // --- Bản thân ---
    html += section('🧑 Bản Thân (Can Ngày)');
    const rDay = analyzePalaceFull(pDay, `Can Ngày [${dayHS}]`, chart);
    html += rDay.html; score += rDay.score;

    // --- Người cho vay (Trực Phù) ---
    html += section('🏦 Người Cho Vay (Trực Phù)');
    const rZF = analyzePalaceFull(pZF, 'Trực Phù (Người cho vay)', chart);
    html += rZF.html;
    if (pZF && isVoid(chart, pZF)) { html += note('⭕ Người cho vay Không Vong: Nguồn vốn không thực chất, có thể hủy khoản vay bất ngờ.', 'bad'); score -= 2; }

    // --- Người đi vay (Trực Sử) ---
    html += section('🙋 Người Đi Vay (Trực Sử)');
    const rTS = analyzePalaceFull(pTS, 'Trực Sử (Người đi vay)', chart);
    html += rTS.html;
    if (pTS && isVoid(chart, pTS)) { html += note('⭕ Người vay Không Vong: Người vay không có thực lực trả nợ — rủi ro cao.', 'bad'); score -= 3; }
    if (pTS && hasRuMu(pTS)) { html += note('🪦 Trực Sử Nhập Mộ: Người vay đang trong tình trạng khó khăn nghiêm trọng — khó đòi lại vốn.', 'bad'); score -= 2; }
    if (pTS && isHorse(chart, pTS)) { html += note('🐎 Người vay có Dịch Mã: Người vay đang biến động, có thể trốn tránh trách nhiệm trả nợ.', 'bad'); score -= 2; }

    // --- Tương quan hai bên ---
    html += section('⚖️ Tương Quan Vay – Cho');
    if (pZF && pTS) {
      const relVT = getRelationBetweenPalaces(pTS, pZF, chart);
      html += line('Người vay ↔ Người cho vay', relVT.label, relVT.rel.includes('sinh') ? 'good' : relVT.rel.includes('khac') ? 'bad' : 'neutral');
      if (relVT.rel === 'a_sinh_b') { html += note('🟢 Người vay sinh cho vay: Trả lãi đúng hạn, sòng phẳng, giao dịch an toàn.', 'good'); score += 3; }
      else if (relVT.rel === 'b_sinh_a') { html += note('🟡 Cho vay sinh người vay: Người cho vay tạo điều kiện nhiều — người vay chủ động hơn trong giao dịch.'); score += 1; }
      else if (relVT.rel === 'a_khac_b') { html += note('🔴 Người vay khắc người cho vay: NGUY HIỂM — Dễ xù nợ, giật nợ, gây thiệt hại cho người cho vay.', 'bad'); score -= 4; }
      else if (relVT.rel === 'b_khac_a') { html += note('🟡 Người cho vay ép người vay: Điều kiện vay nghiêm ngặt — người vay phải cân nhắc kỹ.'); score += 1; }
    }

    // --- Xác định bản thân là bên nào ---
    html += section('🔍 Phân Tích Theo Vai Trò Người Hỏi');
    if (pDay && pZF) {
      if (pDay.cung === pZF.cung) {
        html += note('Người hỏi là NGƯỜI CHO VAY (đồng cung Trực Phù). Đánh giá khả năng thu hồi vốn:', 'info');
        if (pTS && !isVoid(chart, pTS) && !hasRuMu(pTS)) { html += note('🟢 Con nợ ổn định: Khả năng thu hồi vốn tốt.', 'good'); score += 2; }
        else { html += note('🔴 Con nợ yếu thế: Cân nhắc có nên cho vay không.', 'bad'); score -= 2; }
      } else if (pDay && pTS && pDay.cung === pTS.cung) {
        html += note('Người hỏi là NGƯỜI ĐI VAY (đồng cung Trực Sử). Đánh giá khả năng vay được:', 'info');
        if (pZF && !isVoid(chart, pZF)) { html += note('🟢 Người cho vay có thực lực: Có thể vay được số tiền mong muốn.', 'good'); score += 2; }
        else { html += note('🔴 Nguồn vay không ổn định: Khoản vay có nguy cơ bị từ chối.', 'bad'); score -= 2; }
      }
    }

    // --- Khoản tiền ---
    html += section('💵 Khoản Tiền (Sinh Môn + Mậu)');
    if (pSinh) { const rSinh = analyzePalaceFull(pSinh, 'Sinh Môn', chart); html += rSinh.html; }
    if (pMau) {
      const rMau = analyzePalaceFull(pMau, 'Mậu (Vốn)', chart); html += rMau.html;
      if (hasRuMu(pMau)) { html += note('🪦 Mậu Nhập Mộ: Khoản tiền bị chôn — khó giải ngân hoặc khó thu hồi.', 'bad'); score -= 2; }
    }

    return { html, score };
  };

  // ===== CHỦ ĐỀ 13: ĐÒI NỢ =====
  TOPIC_ANALYZERS[13] = function(chart) {
    let score = 0, html = '';
    const dayHS = getStemOf(chart, 'day');
    const hourHS = getStemOf(chart, 'hour');
    const pDay = findPalaceByHeavenlyStem(chart, dayHS);
    const pHour = findPalaceByHeavenlyStem(chart, hourHS);
    const pThuong = findPalaceByGate(chart, 'Thương');
    const pSinh = findPalaceByGate(chart, 'Sinh');

    // --- Chủ nợ (bản thân) ---
    html += section('🧑 Chủ Nợ (Can Ngày)');
    const rDay = analyzePalaceFull(pDay, `Can Ngày [${dayHS}]`, chart);
    html += rDay.html; score += rDay.score;

    // --- Con nợ (Can Giờ hoặc Thái Ất) ---
    html += section('😰 Con Nợ (Can Giờ)');
    const rHour = analyzePalaceFull(pHour, `Can Giờ [${hourHS}] (Con nợ)`, chart);
    html += rHour.html;

    if (pHour && isVoid(chart, pHour)) { html += note('⭕ Con nợ Không Vong: Người nợ thực sự không có tiền trả, hoặc đang cố tình "bốc hơi".', 'bad'); score -= 3; }
    if (pHour && hasRuMu(pHour)) { html += note('🪦 Con nợ Nhập Mộ: Người nợ đang bị phong tỏa tài sản, hoặc ẩn nấp không liên lạc được.', 'bad'); score -= 2; }
    if (pHour && isHorse(chart, pHour)) { html += note('🐎 Dịch Mã: Con nợ đang trong trạng thái di chuyển liên tục — có nguy cơ bỏ trốn.', 'bad'); score -= 3; }

    // Tương quan chủ nợ và con nợ
    if (pDay && pHour) {
      const rel = getRelationBetweenStems(dayHS, hourHS);
      if (rel.rel === 'a_khac_b') { html += note('🟢 Chủ nợ khắc con nợ: Thế mạnh về phía chủ nợ — đòi nợ có khả năng thành công.', 'good'); score += 2; }
      else if (rel.rel === 'b_khac_a') { html += note('🔴 Con nợ khắc chủ nợ: Con nợ đang chiếm thế — đòi nợ gặp nhiều cản trở, ngoan cố không chịu trả.', 'bad'); score -= 3; }
      else if (rel.rel === 'a_sinh_b') { html += note('🟡 Chủ nợ sinh con nợ: Vô tình tạo điều kiện cho con nợ tiếp tục né tránh.'); score -= 1; }
      if (pDay.cung === pHour.cung) { html += note('🟢 Đồng cung: Chủ nợ và con nợ sẽ gặp mặt — cơ hội đàm phán trực tiếp rất cao.', 'good'); score += 3; }
    }

    // --- Hành động đòi nợ (Thương Môn) ---
    html += section('⚔️ Hiệu Quả Đòi Nợ (Thương Môn)');
    const rThuong = analyzePalaceFull(pThuong, 'Thương Môn', chart);
    html += rThuong.html;
    if (pThuong && isVoid(chart, pThuong)) { html += note('⭕ Thương Môn Không Vong: Mọi nỗ lực đòi nợ đều vô ích — hao công mà không thu được gì.', 'bad'); score -= 3; }
    if (pThuong && hasRuMu(pThuong)) { html += note('🪦 Thương Môn Nhập Mộ: Kế hoạch đòi nợ bị phong tỏa — cần tìm phương án khác (nhờ luật pháp).', 'bad'); score -= 2; }
    if (pThuong && hasPattern(pThuong, 'phản ngâm')) { html += note('🔄 Thương Môn Phản Ngâm: Đòi nợ tạo ra xung đột lớn, khả năng leo thang thành kiện tụng.'); score -= 1; }

    // --- Khoản tiền (Sinh Môn) ---
    html += section('💵 Khoản Tiền Đòi Được (Sinh Môn)');
    const rSinh = analyzePalaceFull(pSinh, 'Sinh Môn', chart);
    html += rSinh.html;
    if (pSinh && hasRuMu(pSinh)) { html += note('🪦 Sinh Môn Nhập Mộ: Tiền bị chôn vùi — không thể thu hồi trong thời gian gần, phải kiện ra tòa.', 'bad'); score -= 2; }
    if (pSinh && isVoid(chart, pSinh)) { html += note('⭕ Sinh Môn Không Vong: Khoản tiền không còn — có thể con nợ đã tiêu hết hoặc chuyển tài sản.', 'bad'); score -= 2; }
    if (pSinh && pDay && pSinh.cung === pDay.cung) { html += note('🟢 Sinh Môn đồng cung bản thân: Tiền đang trên đường về tay — đòi nợ sắp thành công!', 'good'); score += 3; }

    // --- Chỉ dấu pháp lý ---
    const pCanh = findPalaceByGate(chart, 'Cảnh');
    const pKhai = findPalaceByGate(chart, 'Khai');
    html += section('⚖️ Nên Kiện Ra Tòa Không?');
    if (pCanh && !isVoid(chart, pCanh)) { html += note('🟢 Cảnh Môn tốt: Nên lập đơn kiện — pháp lý sẽ hỗ trợ bạn.', 'good'); score += 1; }
    if (pKhai && !isVoid(chart, pKhai) && !hasRuMu(pKhai)) { html += note('🟢 Khai Môn tốt: Tòa sẽ thụ lý và xét xử có lợi cho chủ nợ.', 'good'); score += 1; }
    if (pCanh && isVoid(chart, pCanh)) { html += note('⭕ Cảnh Môn Không Vong: Chứng từ chưa đủ để kiện — cần thu thập thêm bằng chứng.', 'bad'); score -= 1; }

    return { html, score };
  };

  // ===== CHỦ ĐỀ 14: THI ĐẤU =====
  TOPIC_ANALYZERS[14] = function(chart) {
    let score = 0, html = '';
    const dayHS = getStemOf(chart, 'day');
    const hourHS = getStemOf(chart, 'hour');
    const pDay = findPalaceByHeavenlyStem(chart, dayHS);
    const pHourEarth = findPalaceByEarthlyStem(chart, hourHS);
    const pHourHeaven = findPalaceByHeavenlyStem(chart, hourHS);
    const pZF = getZhifuPalace(chart);
    const pTS = getZhishiPalace(chart);

    // --- Bên được hỏi (Can Ngày) ---
    html += section(`🏆 Bên Được Hỏi (Can Ngày: ${dayHS})`);
    const rDay = analyzePalaceFull(pDay, `Can Ngày [${dayHS}]`, chart);
    html += rDay.html; score += rDay.score;
    if (pDay && isVoid(chart, pDay)) { html += note('⭕ Bên này Không Vong: Phong độ đang rất kém, không ở trạng thái tốt nhất.', 'bad'); score -= 3; }

    // --- Hai đội ---
    html += section('⚔️ So Sánh Lực Lượng Hai Đội');
    const rEarth = analyzePalaceFull(pHourEarth, 'Địa Bàn Giờ (Chủ Nhà)', chart);
    html += rEarth.html;
    const rHeaven = analyzePalaceFull(pHourHeaven, 'Thiên Bàn Giờ (Đội Khách)', chart);
    html += rHeaven.html;

    if (pHourEarth && pHourHeaven) {
      const relTeams = getRelationBetweenPalaces(pHourHeaven, pHourEarth, chart);
      html += line('Đội Khách ↔ Chủ Nhà', relTeams.label, relTeams.rel.includes('khac') ? 'bad' : relTeams.rel.includes('sinh') ? 'good' : 'neutral');
      if (relTeams.rel === 'a_khac_b') { html += note('🔴 Khách khắc Chủ: Đội khách áp đảo hoàn toàn — khách thắng.', 'bad'); score -= 2; }
      else if (relTeams.rel === 'b_khac_a') { html += note('🟢 Chủ khắc Khách: Sân nhà phát huy uy lực mạnh — chủ nhà thắng.', 'good'); score += 2; }
      else if (relTeams.rel === 'a_sinh_b') { html += note('🟡 Khách sinh Chủ: Chủ nhà nhận năng lượng — cuộc chơi nghiêng về chủ nhà.', 'good'); score += 1; }
      else if (relTeams.rel === 'b_sinh_a') { html += note('🟡 Chủ sinh Khách: Cuộc chơi lợi thế cho đội khách.'); score -= 1; }
      else { html += note('⚖️ Hai đội ngang tài ngang sức — kết quả khó đoán, phụ thuộc vào yếu tố ngẫu nhiên.'); }
    }

    // Độ mạnh của từng đội
    html += section('📊 Phân Tích Sức Mạnh Chi Tiết');
    let homeScore = 0, awayScore = 0;
    if (pHourEarth) {
      homeScore += getGateScore(pHourEarth.batMon || '');
      homeScore += getDeityScore(getEffectiveDeityName(pHourEarth, chart));
      homeScore += getStarScore(pHourEarth.thienBan || '');
      if (isVoid(chart, pHourEarth)) homeScore -= 3;
      if (hasRuMu(pHourEarth)) homeScore -= 2;
    }
    if (pHourHeaven) {
      awayScore += getGateScore(pHourHeaven.batMon || '');
      awayScore += getDeityScore(getEffectiveDeityName(pHourHeaven, chart));
      awayScore += getStarScore(pHourHeaven.thienBan || '');
      if (isVoid(chart, pHourHeaven)) awayScore -= 3;
      if (hasRuMu(pHourHeaven)) awayScore -= 2;
    }
    html += line('Điểm Chủ Nhà', `${homeScore >= 0 ? '+' : ''}${homeScore}`, homeScore > awayScore ? 'good' : 'bad');
    html += line('Điểm Đội Khách', `${awayScore >= 0 ? '+' : ''}${awayScore}`, awayScore > homeScore ? 'good' : 'bad');
    if (homeScore > awayScore) { html += verdict(`🟢 Chủ nhà mạnh hơn (chênh lệch ${homeScore - awayScore} điểm). Dự đoán: CHỦ NHÀ THẮNG.`, 'good'); score += 1; }
    else if (awayScore > homeScore) { html += verdict(`🔴 Đội khách mạnh hơn (chênh lệch ${awayScore - homeScore} điểm). Dự đoán: ĐỘI KHÁCH THẮNG.`, 'bad'); score -= 1; }
    else { html += verdict('⚖️ Hai đội cân bằng. Kết quả hoà hoặc phụ thuộc penalty/hiệp phụ.', 'neutral'); }

    // So sánh với bên được hỏi
    html += section('🎯 Kết Luận Cho Bên Được Hỏi');
    if (pDay) {
      const dayGateScore = getGateScore(pDay.batMon || '') + getDeityScore(getEffectiveDeityName(pDay, chart)) + getStarScore(pDay.thienBan || '');
      html += line('Điểm bên hỏi', `${dayGateScore >= 0 ? '+' : ''}${dayGateScore}`, dayGateScore > 0 ? 'good' : 'bad');
      if (dayGateScore > homeScore && dayGateScore > awayScore) { html += verdict('✅ Bên được hỏi ở thế mạnh nhất trong trận — XÁC SUẤT THẮNG CAO.', 'good'); score += 2; }
      else { html += verdict('⚠️ Bên được hỏi không phải thế mạnh nhất trận — XÁC SUẤT THẮNG THẤP.', 'bad'); score -= 1; }
    }

    // --- Trọng tài ---
    html += section('👨‍⚖️ Trọng Tài (Trực Phù)');
    if (pZF) {
      const rZF = analyzePalaceFull(pZF, 'Trực Phù (Trọng tài)', chart);
      html += rZF.html;
      const dZF = getEffectiveDeityName(pZF, chart);
      if (dZF.includes('Huyền Vũ') || dZF.includes('Đằng Xà')) { html += note('🔴 Trọng tài + Huyền Vũ/Đằng Xà: Nguy cơ trọng tài thiên vị hoặc gian lận.', 'bad'); score -= 1; }
    }

    return { html, score };
  };

  // ===== CHỦ ĐỀ 15: THI CỬ =====
  TOPIC_ANALYZERS[15] = function(chart) {
    let score = 0, html = '';
    const dayHS = getStemOf(chart, 'day');
    const yearHS = getStemOf(chart, 'year');
    const pDay = findPalaceByHeavenlyStem(chart, dayHS);
    const pYear = findPalaceByHeavenlyStem(chart, yearHS);
    const pCanh = findPalaceByGate(chart, 'Cảnh');
    const pPhu = findPalaceByStarName(chart, 'Thiên Phụ');
    const pZF = getZhifuPalace(chart);

    // --- Thí sinh ---
    html += section('👤 Thí Sinh (Can Ngày)');
    const rDay = analyzePalaceFull(pDay, `Can Ngày [${dayHS}]`, chart);
    html += rDay.html; score += rDay.score;
    if (pDay && isVoid(chart, pDay)) { html += note('⭕ Thí sinh Không Vong: Tâm trạng trống rỗng, mất phương hướng trong phòng thi — điểm số sẽ kém.', 'bad'); score -= 3; }
    if (pDay && hasRuMu(pDay)) { html += note('🪦 Thí sinh Nhập Mộ: Không thể bộc lộ hết kiến thức đã học — dưới mức thực lực.', 'bad'); score -= 2; }

    // --- Bài thi / Điểm số (Cảnh Môn) ---
    html += section('📝 Đề Thi & Điểm Số (Cảnh Môn)');
    const rCanh = analyzePalaceFull(pCanh, 'Cảnh Môn (Đề thi)', chart);
    html += rCanh.html; score += rCanh.score;

    if (pCanh && pDay) {
      const rel = getRelationBetweenPalaces(pCanh, pDay, chart);
      html += line('Đề thi ↔ Thí sinh', rel.label, rel.rel.includes('sinh') ? 'good' : rel.rel.includes('khac') ? 'bad' : 'neutral');
      if (rel.rel === 'a_sinh_b') { html += note('🟢 Đề thi sinh thí sinh: TRÚNG TỦ — Bài thi ra đúng phần sở trường, làm bài rất tốt.', 'good'); score += 4; }
      else if (rel.rel === 'b_sinh_a') { html += note('🟡 Thí sinh dành hết sức cho bài thi: Làm bài nghiêm túc nhưng có thể gặp câu hỏi ngoài sở trường.'); score += 1; }
      else if (rel.rel === 'a_khac_b') { html += note('🔴 Đề thi khắc thí sinh: BÀI KHÓ — Ra đúng phần điểm yếu, cần rất nhiều nỗ lực mới vượt qua.', 'bad'); score -= 3; }
      else if (rel.rel === 'b_khac_a') { html += note('🟡 Thí sinh khắc đề: Làm bài vất vả, cần tư duy nhiều nhưng vẫn vượt qua được.'); score += 1; }
      else { html += note('🟡 Tỷ hòa: Bài thi ở mức độ phù hợp năng lực — kết quả phụ thuộc vào mức độ chuẩn bị.'); score += 1; }
    }
    if (pCanh && isVoid(chart, pCanh)) { html += note('⭕ Cảnh Môn Không Vong: Làm bài lạc đề, điểm thấp, hoặc bài thi bị hủy/dời.', 'bad'); score -= 3; }
    if (pCanh && hasRuMu(pCanh)) { html += note('🪦 Cảnh Môn Nhập Mộ: Điểm bị nhốt lại, có khả năng phúc tra hoặc kết quả bị treo.', 'bad'); score -= 1; }

    // --- Giám khảo / Giáo viên (Thiên Phụ) ---
    html += section('👩‍🏫 Giám Khảo / Phòng Thi (Thiên Phụ)');
    if (pPhu) {
      const rPhu = analyzePalaceFull(pPhu, 'Thiên Phụ', chart);
      html += rPhu.html;
      if (pDay) {
        const relGK = getRelationBetweenPalaces(pPhu, pDay, chart);
        if (relGK.rel === 'a_sinh_b') { html += note('🟢 Giám khảo sinh thí sinh: Người chấm bài sẽ đánh giá cao và cho điểm công bằng.', 'good'); score += 2; }
        else if (relGK.rel === 'a_khac_b') { html += note('🔴 Giám khảo khắc thí sinh: Người chấm bài khắt khe, có thể bị trừ điểm nhiều hơn bình thường.', 'bad'); score -= 2; }
      }
      if (isVoid(chart, pPhu)) { html += note('⭕ Thiên Phụ Không Vong: Giám thị không để ý, phòng thi có sự cố, hoặc thiếu người hướng dẫn.'); }
    }

    // --- Giám sát (Trực Phù) / Trường thi (Can Năm) ---
    html += section('🏫 Môi Trường Thi Cử');
    if (pZF) {
      const rZF = analyzePalaceFull(pZF, 'Trực Phù (Giám sát)', chart);
      html += rZF.html;
      const dZF = getEffectiveDeityName(pZF, chart);
      if (dZF.includes('Huyền Vũ')) { html += note('🔴 Giám sát + Huyền Vũ: Coi chừng vi phạm quy chế thi, gian lận bị phát hiện.', 'bad'); score -= 2; }
    }
    if (pYear) {
      const rYear = analyzePalaceFull(pYear, `Can Năm [${yearHS}] (Trường thi)`, chart);
      html += rYear.html;
      if (pDay) {
        const relSchool = getRelationBetweenPalaces(pYear, pDay, chart);
        if (relSchool.rel === 'a_sinh_b') { html += note('🟢 Trường thi sinh thí sinh: Trường phù hợp năng lực — có thể đậu với điểm cao.', 'good'); score += 2; }
        else if (relSchool.rel === 'a_khac_b') { html += note('🔴 Trường thi khắc thí sinh: Ngưỡng điểm này vượt tầm — nên cân nhắc trường khác.', 'bad'); score -= 2; }
      }
    }

    // --- Thần đi kèm ---
    const dCanh = pCanh ? getEffectiveDeityName(pCanh, chart) : '';
    if (dCanh.includes('Trực Phù')) { html += note('🟢 Trực Phù tại Cảnh Môn: Bài thi đúng theo hướng bạn đã chuẩn bị, rất cát.', 'good'); score += 1; }
    if (dCanh.includes('Cửu Thiên')) { html += note('🟢 Cửu Thiên tại Cảnh Môn: Bài thi nằm trong tầm với, làm bài xuất sắc.', 'good'); score += 1; }
    if (dCanh.includes('Huyền Vũ')) { html += note('🔴 Huyền Vũ tại Cảnh Môn: Đề thi bí ẩn, ra ngoài chương trình — dễ làm sai.', 'bad'); score -= 1; }

    return { html, score };
  };

  // ===== CHỦ ĐỀ 16: CHỖ ĐỖ XE =====
  TOPIC_ANALYZERS[16] = function(chart) {
    let score = 0, html = '';
    const voids = getAllVoidPalaces(chart);

    html += section('🅿️ Tìm Vị Trí Đỗ Xe (Cung Không Vong)');

    if (!voids.length) {
      html += note('🔴 Không tìm thấy cung Không Vong: Bãi xe hiện tại có thể đã đầy hoàn toàn. Hãy thử tìm bãi khác.', 'bad');
      score -= 2;
    } else {
      html += note(`🟢 Tìm thấy ${voids.length} khu vực có chỗ trống. Ưu tiên theo thứ tự dưới đây:`, 'good');
      voids.forEach((p, idx) => {
        const name = palaceName(p.cung, chart);
        const dir = palaceDirection(p.cung, chart);
        const hanh = palaceElement(p.cung, chart);
        const gate = p.batMon || '';
        const star = p.thienBan || '';
        const prio = idx === 0 ? '⭐ Ưu tiên 1' : `${idx + 1}.`;
        html += line(`${prio}: Cung ${name} (${dir})`, `${hanh} — ${gate} · ${star}`, idx === 0 ? 'good' : 'neutral');
        score += 1;
      });
      const best = voids[0];
      html += note(`📍 Hướng đỗ xe tốt nhất: ${palaceDirection(best.cung, chart)} (Cung ${palaceName(best.cung, chart)}). Điều hướng về phía đó.`, 'good');
    }

    // Tham khảo thêm qua Cảnh Môn
    html += section('🚗 Tham Khảo Đường Vào Bãi Xe (Cảnh Môn)');
    const pCanh = findPalaceByGate(chart, 'Cảnh');
    if (pCanh) {
      html += line('Đường vào bãi xe', `Hướng ${palaceDirection(pCanh.cung, chart)} — ${palaceName(pCanh.cung, chart)}`, isVoid(chart, pCanh) ? 'bad' : 'good');
      if (isVoid(chart, pCanh)) { html += note('⭕ Cảnh Môn Không Vong: Đường vào bãi bị chặn hoặc đóng cửa, tìm lối vào khác.', 'bad'); score -= 1; }
    }

    // Dịch Mã cho thấy xe có thể đang di chuyển liên tục
    const horsePalaces = getAllPalaces(chart).filter(p => isHorse(chart, p));
    if (horsePalaces.length) {
      const dirs = horsePalaces.map(p => palaceDirection(p.cung, chart)).join(', ');
      html += note(`🐎 Dịch Mã xuất hiện ở hướng ${dirs}: Xe cộ đang ra vào liên tục ở khu vực này — có thể xuất hiện chỗ trống bất ngờ.`);
    }

    return { html, score };
  };

  // ===== CHỦ ĐỀ 17: DU LỊCH =====
  TOPIC_ANALYZERS[17] = function(chart) {
    let score = 0, html = '';
    const dayHS = getStemOf(chart, 'day');
    const hourHS = getStemOf(chart, 'hour');
    const pDay = findPalaceByHeavenlyStem(chart, dayHS);
    const pHour = findPalaceByHeavenlyStem(chart, hourHS);
    const pCanh = findPalaceByGate(chart, 'Cảnh');
    const pThuong = findPalaceByGate(chart, 'Thương');
    const pHuu = findPalaceByGate(chart, 'Hưu');
    const pKhai = findPalaceByGate(chart, 'Khai');
    const pBong = findPalaceByStarName(chart, 'Thiên Bồng');
    const pCuuThien = findPalaceByDeityName(chart, 'Cửu Thiên');

    // --- Người đi ---
    html += section('✈️ Người Du Lịch (Can Ngày)');
    const rDay = analyzePalaceFull(pDay, `Can Ngày [${dayHS}]`, chart);
    html += rDay.html; score += rDay.score;

    // --- Hành trình (Can Giờ) ---
    html += section('🗺️ Chuyến Đi (Can Giờ)');
    const rHour = analyzePalaceFull(pHour, `Hành trình [${hourHS}]`, chart);
    html += rHour.html;

    if (pHour && pDay) {
      const rel = getRelationBetweenPalaces(pHour, pDay, chart);
      if (rel.rel === 'a_sinh_b') { html += note('🟢 Chuyến đi sinh bản thân: Du lịch này sẽ bồi dưỡng sức khỏe, tinh thần sảng khoái, mở ra cơ hội mới.', 'good'); score += 3; }
      else if (rel.rel === 'a_khac_b') { html += note('🔴 Chuyến đi khắc bản thân: Dễ gặp sự cố, mệt mỏi, hoặc tốn kém nhiều hơn dự kiến.', 'bad'); score -= 2; }
    }
    if (pHour && isVoid(chart, pHour)) { html += note('⭕ Chuyến đi Không Vong: Chuyến đi sẽ bị hủy, hoãn, hoặc không đáng như kỳ vọng.', 'bad'); score -= 3; }
    if (pHour && hasRuMu(pHour)) { html += note('🪦 Hành trình Nhập Mộ: Bị kẹt ở điểm đến, khó về hoặc gặp trở ngại nghiêm trọng.', 'bad'); score -= 2; }
    if (pHour && isHorse(chart, pHour)) { html += note('🐎 Dịch Mã: Chuyến đi có nhiều điểm dừng chân, hành trình năng động.', 'good'); score += 1; }

    // --- Loại phương tiện ---
    html += section('🚘 Phương Tiện Di Chuyển');
    if (pCanh) {
      html += line('Đường bộ (Cảnh Môn)', palaceSummary(pCanh, chart), isVoid(chart, pCanh) ? 'bad' : 'good');
      if (isVoid(chart, pCanh)) { html += note('⭕ Cảnh Môn Không Vong: Đường bộ có vấn đề — tắc đường, sự cố, hoặc cung đường bị chặn.', 'bad'); score -= 1; }
    }
    if (pHuu) {
      html += line('Đường thủy (Hưu Môn)', palaceSummary(pHuu, chart), isVoid(chart, pHuu) ? 'bad' : 'good');
    }
    if (pKhai || pCuuThien) {
      const pAir = pKhai || pCuuThien;
      html += line('Hàng không (Khai/Cửu Thiên)', palaceSummary(pAir, chart), isVoid(chart, pAir) ? 'bad' : 'good');
      if (pAir && isVoid(chart, pAir)) { html += note('⭕ Hàng không Không Vong: Chuyến bay có rủi ro hủy, hoãn, hoặc sự cố hành lý.', 'bad'); score -= 1; }
    }
    if (pThuong) {
      html += line('Xe / Tàu (Thương Môn)', palaceSummary(pThuong, chart), isVoid(chart, pThuong) ? 'bad' : 'good');
    }

    // --- Thiên Bồng ---
    html += section('⚠️ Rủi Ro Hành Trình');
    if (pBong) {
      if (pBong.cung === pHour?.cung || pBong.cung === pDay?.cung) {
        html += note('🔴 Thiên Bồng xuất hiện trên hành trình: NGUY HIỂM — Đề phòng trộm cắp, thời tiết xấu, tai nạn giao thông, hoặc xung đột với người địa phương.', 'bad');
        score -= 3;
      } else {
        html += note(`Thiên Bồng ở Cung ${palaceName(pBong.cung, chart)} (${palaceDirection(pBong.cung, chart)}): Cẩn thận khu vực hướng này khi di chuyển.`);
        score -= 1;
      }
    }

    // Chỉ dấu bát thần
    const deityHour = pHour ? getEffectiveDeityName(pHour, chart) : '';
    if (deityHour.includes('Huyền Vũ')) { html += note('🔴 Huyền Vũ trên hành trình: Nguy cơ mất trộm, lừa đảo tại điểm du lịch.', 'bad'); score -= 2; }
    if (deityHour.includes('Đằng Xà')) { html += note('🔴 Đằng Xà: Thông tin du lịch sai lệch, đặt phòng/tour bị gian lận.', 'bad'); score -= 2; }
    if (deityHour.includes('Thái Âm')) { html += note('🟢 Thái Âm: Chuyến đi yên tĩnh, ẩn khuất — phù hợp du lịch nghỉ dưỡng, tĩnh tâm.', 'good'); score += 1; }
    if (deityHour.includes('Lục Hợp')) { html += note('🟢 Lục Hợp: Dễ kết bạn mới, gặp người có ích trong chuyến đi.', 'good'); score += 1; }
    if (deityHour.includes('Cửu Thiên')) { html += note('🟢 Cửu Thiên: Chuyến đi tầm xa, phong phú, nhiều trải nghiệm thú vị.', 'good'); score += 1; }

    // Cục tổng thể
    if (hasGlobalPattern(chart, 'phản ngâm')) { html += note('🔄 Phản Ngâm: Có thể phải quay về sớm hoặc thay đổi lịch trình đột xuất.'); score -= 1; }
    if (hasGlobalPattern(chart, 'phục ngâm')) { html += note('⏸️ Phục Ngâm: Chuyến đi đứng yên, kẹt tại một chỗ lâu hơn dự kiến.'); score -= 1; }

    return { html, score };
  };

    // ============================ SỬA: CHỦ ĐỀ 18 — HÔN NHÂN (LOGIC ĐÚNG) ============================
  TOPIC_ANALYZERS[18] = function(chart) {
    let score = 0, html = '';

    // Tìm cung của Ất (vợ) và Canh (chồng) trên thiên bàn
    const pAt = findPalaceByHeavenlyStem(chart, 'Ất');
    const pCanh = findPalaceByHeavenlyStem(chart, 'Canh');
    const pLH = findPalaceByDeityName(chart, 'Lục Hợp');
    const pBinh = findPalaceByHeavenlyStem(chart, 'Bính');
    const pDinh = findPalaceByHeavenlyStem(chart, 'Đinh');

    // --- Bên Nữ (Ất) ---
    html += section('👫 Bên Nữ / Vợ (Ất trên Thiên Bàn)');
    if (pAt) {
      const rAt = analyzePalaceFull(pAt, 'Ất (Bên Nữ)', chart);
      html += rAt.html;
      score += rAt.score * 0.3;
      if (isVoid(chart, pAt)) {
        html += note('⭕ Ất Không Vong: Bên nữ thiếu quyết tâm hoặc chưa thực sự sẵn sàng tiến tới.', 'bad'); score -= 2;
      }
      if (hasRuMu(pAt)) {
        html += note('🪦 Ất Nhập Mộ: Bên nữ đang bị ràng buộc — có thể đang trong mối quan hệ cũ chưa kết thúc.', 'bad'); score -= 2;
      }
    } else {
      html += note('⚠️ Không tìm thấy Ất trên thiên bàn — Bên nữ ẩn phục, khó đoán tâm ý.', 'neutral');
    }

    // --- Bên Nam (Canh) ---
    html += section('👨 Bên Nam / Chồng (Canh trên Thiên Bàn)');
    if (pCanh) {
      const rCanh = analyzePalaceFull(pCanh, 'Canh (Bên Nam)', chart);
      html += rCanh.html;
      score += rCanh.score * 0.3;
      if (isVoid(chart, pCanh)) {
        html += note('⭕ Canh Không Vong: Bên nam chưa thực tâm hoặc không đủ điều kiện xây dựng gia đình lúc này.', 'bad'); score -= 2;
      }
      if (hasRuMu(pCanh)) {
        html += note('🪦 Canh Nhập Mộ: Bên nam bị phong tỏa — sự nghiệp, tài chính hoặc tình cảm đang bế tắc.', 'bad'); score -= 2;
      }
    } else {
      html += note('⚠️ Không tìm thấy Canh trên thiên bàn — Bên nam ẩn phục, khó đoán.', 'neutral');
    }

    // --- Tương quan Ất ↔ Canh qua VỊ TRÍ CUNG (không qua ngũ hành can cố định) ---
    html += section('💑 Tương Quan Hai Bên (So Sánh Qua Cung)');
    if (pAt && pCanh) {

      // ✅ Kiểm tra Ất-Canh hợp hóa (đây là cặp thiên can hợp đặc biệt)
      // Ất Canh hợp hóa Kim — đây là DẤU HIỆU DUYÊN PHẬN quan trọng nhất
      const atCanhHop = true; // Ất+Canh luôn hợp hóa Kim theo ngũ hành thiên can hợp
      html += note('💫 Ất + Canh là cặp Thiên Can Hợp (hợp hóa Kim).', 'good');
      score += 2;

      // So sánh ngũ hành CUNG của Ất và Canh (vị trí thực trên bàn)
      const relCung = getRelationBetweenPalaces(pAt, pCanh, chart);
      const hAt = getCungMeta(pAt.cung, chart).hanh;
      const hCanh = getCungMeta(pCanh.cung, chart).hanh;

      html += line(
        `Cung Ất [${palaceName(pAt.cung, chart)}·${hAt}] ↔ Cung Canh [${palaceName(pCanh.cung, chart)}·${hCanh}]`,
        relCung.label,
        relCung.rel.includes('sinh') ? 'good' : relCung.rel.includes('khac') ? 'bad' : 'neutral'
      );

      if (relCung.rel === 'dong_hanh') {
        html += note('🟢 Hai cung đồng ngũ hành: Vợ chồng hòa hợp, tư duy tương đồng, ít xung đột.', 'good'); score += 2;
      } else if (relCung.rel === 'a_sinh_b') {
        html += note('🟢 Cung Ất sinh Cung Canh: Bên nữ chủ động vun đắp, nâng đỡ bên nam — hôn nhân hòa thuận, bền vững.', 'good'); score += 3;
      } else if (relCung.rel === 'b_sinh_a') {
        html += note('🟢 Cung Canh sinh Cung Ất: Bên nam chủ động vun đắp, nâng đỡ bên nữ — tình cảm thắm thiết, hôn nhân ổn định.', 'good'); score += 3;
      } else if (relCung.rel === 'a_khac_b') {
        html += note('🔴 Cung Ất khắc Cung Canh: Bên nữ khắc chế bên nam — nam thường ở thế bị động, dễ bị kiểm soát, xung đột về quyền lực trong gia đình.', 'bad'); score -= 2;
      } else if (relCung.rel === 'b_khac_a') {
        html += note('🔴 Cung Canh khắc Cung Ất: Bên nam khắc chế bên nữ — nữ dễ bị áp lực, không được tôn trọng, ảnh hưởng đến sức khỏe và tâm lý.', 'bad'); score -= 2;
      }

      // Đồng cung — tín hiệu gắn kết mạnh nhất
      if (pAt.cung === pCanh.cung) {
        html += note('🟢✨ Ất và Canh đồng cung: Vợ chồng như hình với bóng — tình cảm keo sơn, không muốn xa rời nhau. Quẻ CỰC CÁT cho hôn nhân.', 'good'); score += 4;
      }

      // Khoảng cách cung (nội/ngoại bàn)
      const sys = chart.sys;
      if (sys) {
        const atInner = sys.NOI_BAN.includes(pAt.cung);
        const canhInner = sys.NOI_BAN.includes(pCanh.cung);
        if (atInner && !canhInner) {
          html += note('🟡 Ất ở Nội bàn, Canh ở Ngoại bàn: Khoảng cách địa lý hoặc tâm lý — hai bên chưa thực sự gần nhau.'); score -= 1;
        } else if (!atInner && canhInner) {
          html += note('🟡 Canh ở Nội bàn, Ất ở Ngoại bàn: Tương tự — hai bên chưa đồng điệu hoàn toàn.'); score -= 1;
        }
      }
    }

    // --- Dây liên kết hôn nhân (Lục Hợp) ---
    html += section('💍 Sợi Dây Hôn Nhân (Lục Hợp)');
    if (pLH) {
      const rLH = analyzePalaceFull(pLH, 'Lục Hợp', chart);
      html += rLH.html;

      // Lục Hợp gần với Ất hay Canh hơn?
      if (pAt && pLH.cung === pAt.cung) {
        html += note('🟢 Lục Hợp đồng cung Ất: Bên nữ đang chủ động trong mối quan hệ — nữ muốn tiến tới hôn nhân.', 'good'); score += 2;
      }
      if (pCanh && pLH.cung === pCanh.cung) {
        html += note('🟢 Lục Hợp đồng cung Canh: Bên nam đang chủ động — nam muốn tiến tới hôn nhân.', 'good'); score += 2;
      }

      if (isVoid(chart, pLH)) {
        html += note('⭕ Lục Hợp Không Vong: Sợi dây hôn nhân lỏng lẻo, hôn lễ chưa thành hoặc quan hệ dễ đứt gãy.', 'bad'); score -= 3;
      }
      if (hasRuMu(pLH)) {
        html += note('🪦 Lục Hợp Nhập Mộ: Hôn nhân bị phong tỏa — hôn lễ bị hoãn dài hạn hoặc quan hệ đã "chết lạnh".', 'bad'); score -= 2;
      }
      if (hasPattern(pLH, 'phục ngâm')) {
        html += note('⏸️ Lục Hợp Phục Ngâm: Quan hệ trì trệ, không tiến không lùi — cần ai đó đưa ra quyết định dứt khoát.'); score -= 1;
      }
      if (hasPattern(pLH, 'phản ngâm')) {
        html += note('🔄 Lục Hợp Phản Ngâm: Sắp có biến động lớn trong quan hệ — có thể chia tay đột ngột hoặc tái hợp bất ngờ.'); score -= 1;
      }
      if (isHorse(chart, pLH)) {
        html += note('🐎 Lục Hợp có Dịch Mã: Hôn lễ sẽ đến nhanh chóng và bất ngờ.', 'good'); score += 1;
      }

      const dLH = getEffectiveDeityName(pLH, chart);
      const deityMeanings = {
        'Huyền Vũ': { msg: '🔴 Huyền Vũ tại Lục Hợp: Có sự lừa dối trong hôn nhân — bí mật được che giấu, thiếu trung thực.', type: 'bad', sc: -3 },
        'Đằng Xà':  { msg: '🔴 Đằng Xà tại Lục Hợp: Nghi ngờ quá mức, sợ hãi không có căn cứ — thiếu niềm tin lẫn nhau.', type: 'bad', sc: -2 },
        'Bạch Hổ':  { msg: '🔴 Bạch Hổ tại Lục Hợp: Dễ xảy ra tranh cãi bạo lực, hoặc một bên gặp tai nạn.', type: 'bad', sc: -2 },
        'Câu Trận': { msg: '🔴 Câu Trận tại Lục Hợp: Quan hệ bị ràng buộc, ứ đọng — không tiến không lui.', type: 'bad', sc: -1 },
        'Chu Tước': { msg: '🔴 Chu Tước tại Lục Hợp: Hay cãi vã, lời nói gây tổn thương — khẩu chiến liên miên.', type: 'bad', sc: -1 },
        'Trực Phù': { msg: '🟢 Trực Phù tại Lục Hợp: Hôn nhân được gia đình và xã hội công nhận mạnh mẽ.', type: 'good', sc: 2 },
        'Thái Âm':  { msg: '🟢 Thái Âm tại Lục Hợp: Hôn nhân êm ấm, kín đáo — bên nữ có vai trò nền tảng vững chắc.', type: 'good', sc: 1 },
        'Cửu Thiên': { msg: '🟢 Cửu Thiên tại Lục Hợp: Hôn nhân diễn ra nhanh chóng, bất ngờ.', type: 'good', sc: 1 },
        'Cửu Địa':  { msg: '🟢 Cửu Địa tại Lục Hợp: Hôn nhân chậm mà chắc, cần thời gian nhưng bền vững lâu dài.', type: 'good', sc: 1 },
        'Lục Hợp':  { msg: '🟢 Lục Hợp gặp chính Lục Hợp: Trùng hợp cát tượng — hôn nhân rất thuận.', type: 'good', sc: 2 }
      };
      for (const [k, v] of Object.entries(deityMeanings)) {
        if (dLH && dLH.includes(k)) {
          html += note(v.msg, v.type); score += v.sc; break;
        }
      }
    } else {
      html += note('⚠️ Lục Hợp ẩn phục: Sợi dây hôn nhân không rõ ràng — quan hệ mơ hồ, chưa có cam kết thực sự.', 'neutral');
      score -= 1;
    }

    // --- Người thứ ba ---
    html += section('⚠️ Kiểm Tra Người Thứ Ba');
    let thirdCount = 0;

    // Bính = người thứ ba nam (xen vào bên nữ)
    if (pBinh) {
      const dBinh = getEffectiveDeityName(pBinh, chart);
      const nearFemale = pAt && (pBinh.cung === pAt.cung);
      const suspectDeity = dBinh.includes('Huyền Vũ') || dBinh.includes('Thái Âm');
      const notVoid = !isVoid(chart, pBinh);

      if (notVoid && (nearFemale || suspectDeity)) {
        html += note(`🔴 Bính (người đàn ông thứ ba) xuất hiện${nearFemale ? ' đồng cung với Ất' : ''}: Nghi ngờ có quan hệ ngoài hôn nhân từ phía nam giới.`, 'bad');
        score -= 3; thirdCount++;
      }
    }

    // Đinh = người thứ ba nữ (xen vào bên nam)
    if (pDinh) {
      const dDinh = getEffectiveDeityName(pDinh, chart);
      const nearMale = pCanh && (pDinh.cung === pCanh.cung);
      const suspectDeity = dDinh.includes('Huyền Vũ') || dDinh.includes('Thái Âm');
      const notVoid = !isVoid(chart, pDinh);

      if (notVoid && (nearMale || suspectDeity)) {
        html += note(`🔴 Đinh (người phụ nữ thứ ba) xuất hiện${nearMale ? ' đồng cung với Canh' : ''}: Nghi ngờ có quan hệ ngoài hôn nhân từ phía nữ giới.`, 'bad');
        score -= 3; thirdCount++;
      }
    }

    if (thirdCount === 0) {
      html += note('🟢 Không phát hiện dấu hiệu người thứ ba. Quan hệ tương đối trong sạch.', 'good'); score += 1;
    }

    // --- Tín hiệu đặc biệt từ Bát Thần ---
    html += section('🔮 Tín Hiệu Đặc Biệt Bát Thần');
    // Kiểm tra Huyền Vũ ở vị trí Ất hoặc Canh
    if (pAt) {
      const dAt = getEffectiveDeityName(pAt, chart);
      if (dAt.includes('Huyền Vũ')) { html += note('🔴 Huyền Vũ tại cung Ất: Bên nữ đang che giấu điều gì đó — thiếu minh bạch.', 'bad'); score -= 2; }
      if (dAt.includes('Đằng Xà')) { html += note('🔴 Đằng Xà tại cung Ất: Bên nữ hay lo lắng, nghi ngờ, dễ tưởng tượng tiêu cực.', 'bad'); score -= 1; }
    }
    if (pCanh) {
      const dCanh = getEffectiveDeityName(pCanh, chart);
      if (dCanh.includes('Huyền Vũ')) { html += note('🔴 Huyền Vũ tại cung Canh: Bên nam đang che giấu điều gì đó — thiếu trung thực.', 'bad'); score -= 2; }
      if (dCanh.includes('Đằng Xà')) { html += note('🔴 Đằng Xà tại cung Canh: Bên nam hay lo lắng hoặc có mưu toan ẩn.', 'bad'); score -= 1; }
      if (dCanh.includes('Cửu Thiên')) { html += note('🟢 Cửu Thiên tại cung Canh: Bên nam có chí tiến thủ, tự tin — hôn nhân mang lại địa vị xã hội tốt.', 'good'); score += 1; }
    }

    // --- Thời điểm ---
    html += section('📅 Thời Điểm Hôn Lễ');
    if (pLH && isHorse(chart, pLH)) { html += note('🐎 Lục Hợp có Dịch Mã: Hôn lễ đến rất gần, nhanh chóng và bất ngờ.', 'good'); score += 1; }
    if (pAt && isHorse(chart, pAt)) { html += note('🐎 Ất có Dịch Mã: Bên nữ đang muốn nhanh chóng tiến tới hôn nhân.'); score += 1; }
    if (pCanh && isHorse(chart, pCanh)) { html += note('🐎 Canh có Dịch Mã: Bên nam đang biến chuyển lớn — hoặc chuẩn bị cầu hôn, hoặc có kế hoạch đi xa.'); }

    // Cục phản/phục ngâm toàn bàn
    if (hasGlobalPattern(chart, 'phản ngâm')) { html += note('🔄 Toàn cục Phản Ngâm: Quan hệ sắp có bước ngoặt quyết định — chia tay hoặc kết hôn.'); score -= 1; }
    if (hasGlobalPattern(chart, 'phục ngâm')) { html += note('⏸️ Toàn cục Phục Ngâm: Hôn nhân trì trệ, khó tiến lên — cần thay đổi cách tiếp cận.'); score -= 1; }

    return { html, score };
  };

  // ===== CHỦ ĐỀ 19: SINH NỞ (GIỚI TÍNH) =====
  TOPIC_ANALYZERS[19] = function(chart) {
    let score = 0, html = '';
    const pKhon = getPalace(chart, 2);

    html += section('👶 Xác Định Giới Tính Em Bé (Cung Khôn)');
    const rKhon = analyzePalaceFull(pKhon, 'Cung Khôn (Người Mẹ)', chart);
    html += rKhon.html;

    if (!pKhon) {
      html += note('🔴 Không tìm thấy Cung Khôn — không thể luận giới tính.', 'bad');
      return { html, score: 0 };
    }

    // Phân tích giới tính
    const gate = pKhon.batMon || '';
    const star = pKhon.thienBan || '';
    const hs = getHeavenlyStem(pKhon);
    const deity = getEffectiveDeityName(pKhon, chart);

    const yangGates = ['Khai','Sinh','Thương','Đỗ'];
    const yinGates = ['Hưu','Cảnh','Tử','Kinh'];
    const yangStars = ['Thiên Xung','Thiên Phụ','Thiên Anh','Thiên Tâm','Thiên Cầm'];
    const yinStars = ['Thiên Bồng','Thiên Nhuế','Thiên Trụ','Thiên Nhậm'];
    const yangStems = ['Giáp','Bính','Mậu','Canh','Nhâm'];
    const yinStems = ['Ất','Đinh','Kỷ','Tân','Quý'];
    const yangDeities = ['Trực Phù','Cửu Thiên','Lục Hợp'];
    const yinDeities = ['Thái Âm','Cửu Địa','Huyền Vũ'];

    let yangCount = 0, yinCount = 0;
    let evidences = [];

    if (yangGates.includes(normalizeGateName(gate))) { yangCount++; evidences.push(`Bát Môn Dương [${gate}]`); }
    else if (yinGates.includes(normalizeGateName(gate))) { yinCount++; evidences.push(`Bát Môn Âm [${gate}]`); }

    if (yangStars.some(s => star.includes(s))) { yangCount++; evidences.push(`Sao Dương [${star}]`); }
    else if (yinStars.some(s => star.includes(s))) { yinCount++; evidences.push(`Sao Âm [${star}]`); }

    if (yangStems.includes(hs)) { yangCount++; evidences.push(`Thiên Can Dương [${hs}]`); }
    else if (yinStems.includes(hs)) { yinCount++; evidences.push(`Thiên Can Âm [${hs}]`); }

    if (yangDeities.some(d => deity.includes(d))) { yangCount++; evidences.push(`Bát Thần Dương [${deity}]`); }
    else if (yinDeities.some(d => deity.includes(d))) { yinCount++; evidences.push(`Bát Thần Âm [${deity}]`); }

    html += section('🔬 Phân Tích Âm Dương');
    html += line('Yếu tố Dương (Trai)', `${yangCount} chỉ dấu: ${evidences.filter((_, i) => [yangGates.includes(normalizeGateName(gate)), yangStars.some(s => star.includes(s)), yangStems.includes(hs), yangDeities.some(d => deity.includes(d))][i]).join(', ')}`, yangCount > yinCount ? 'good' : 'neutral');
    html += line('Yếu tố Âm (Gái)', `${yinCount} chỉ dấu`, yinCount > yangCount ? 'good' : 'neutral');

    const confidence = Math.abs(yangCount - yinCount);
    let confidenceLabel = confidence === 0 ? 'Rất khó đoán (50/50)' : confidence === 1 ? 'Có xu hướng nhẹ' : confidence === 2 ? 'Tương đối chắc' : 'Khá chắc chắn';

    if (yangCount > yinCount) {
      html += verdict(`👦 Dự đoán: BÉ TRAI (Dương mạnh hơn ${yangCount} vs ${yinCount}). ${confidenceLabel}.`, yangCount >= 3 ? 'good' : 'neutral');
      score += 1;
    } else if (yinCount > yangCount) {
      html += verdict(`👧 Dự đoán: BÉ GÁI (Âm mạnh hơn ${yinCount} vs ${yangCount}). ${confidenceLabel}.`, yinCount >= 3 ? 'good' : 'neutral');
      score += 1;
    } else {
      html += verdict('🤔 Không thể kết luận — Âm Dương ngang nhau (50/50). Cần kết hợp thêm phương pháp khác.', 'neutral');
    }

    // Bổ sung: Kiểm tra cung Khôn với Không Vong
    html += section('🏥 Tình Trạng Thai Nhi');
    if (isVoid(chart, pKhon)) { html += note('⭕ Cung Khôn Không Vong: Thai nhi có dấu hiệu không ổn định — nên khám thai kỹ lưỡng.', 'bad'); score -= 2; }
    else { html += note('🟢 Cung Khôn ổn định: Thai kỳ nhìn chung bình thường.', 'good'); score += 1; }

    return { html, score };
  };

  // ===== CHỦ ĐỀ 20: SINH NỞ (AN TOÀN) =====
  TOPIC_ANALYZERS[20] = function(chart) {
    let score = 0, html = '';
    const pKhon = getPalace(chart, 2);
    const pNhue = findPalaceByStarName(chart, 'Thiên Nhuế');

    // --- Cung Khôn (Mẹ và Em bé) ---
    html += section('👩‍🍼 Người Mẹ & Em Bé (Cung Khôn)');
    const rKhon = analyzePalaceFull(pKhon, 'Cung Khôn', chart);
    html += rKhon.html;

    if (pKhon) {
      const gate = pKhon.batMon || '';
      const deity = getEffectiveDeityName(pKhon, chart);

      if (deity.includes('Bạch Hổ')) {
        html += note('⚡ Bạch Hổ tại Cung Khôn: Sinh nhanh nhưng có nguy cơ băng huyết hoặc biến chứng cấp tính — cần chuẩn bị kỹ.', 'bad'); score -= 1;
      }
      if (normalizeGateName(gate) === 'Tử') { html += note('🔴 Tử Môn tại Cung Khôn: Sinh đẻ nguy hiểm — cần mổ lấy thai hoặc can thiệp y tế khẩn cấp.', 'bad'); score -= 3; }
      if (normalizeGateName(gate) === 'Sinh') { html += note('🟢 Sinh Môn tại Cung Khôn: Sinh đẻ thuận lợi, mẹ tròn con vuông.', 'good'); score += 3; }
      if (normalizeGateName(gate) === 'Khai') { html += note('🟢 Khai Môn tại Cung Khôn: Ca sinh kết quả tốt đẹp, thông thoáng.', 'good'); score += 2; }
      if (hasPattern(pKhon, 'phục ngâm')) { html += note('⏸️ Cung Khôn Phục Ngâm: Sinh lâu, trở dạ kéo dài, khó sinh — cần bác sĩ theo dõi sát.', 'bad'); score -= 2; }
      if (hasPattern(pKhon, 'phản ngâm')) { html += note('🔄 Phản Ngâm tại Cung Khôn: Có thể phải mổ lấy thai đột xuất.', 'bad'); score -= 1; }
      if (isVoid(chart, pKhon)) { html += note('⭕ Cung Khôn Không Vong: Thai kỳ có biến động, đặt biệt chú ý giai đoạn cuối thai kỳ.', 'bad'); score -= 2; }
    }

    // --- Thiên Nhuế (Mẹ) ---
    html += section('🌡️ Thiên Nhuế (Đánh Giá Sức Khỏe Mẹ)');
    if (pNhue) {
      const rNhue = analyzePalaceFull(pNhue, 'Thiên Nhuế', chart);
      html += rNhue.html;

      // Quan hệ Mẹ (Thiên Nhuế) và Em bé (Cung Khôn)
      if (pKhon) {
        html += section('⚖️ Tương Quan Mẹ ↔ Bé');
        const rel = getRelationBetweenPalaces(pNhue, pKhon, chart);
        html += line('Thiên Nhuế (Mẹ) ↔ Cung Khôn (Bé)', rel.label, rel.rel.includes('khac') ? 'good' : 'neutral');

        if (rel.rel === 'a_khac_b') {
          html += note('🟢 Mẹ khắc Bé: CA SINH AN TOÀN — Mẹ đủ sức kiểm soát, con ra đời thuận lợi.', 'good'); score += 3;
        } else if (rel.rel === 'b_khac_a') {
          html += note('🔴 Bé khắc Mẹ: NGUY HIỂM CHO MẸ — Sinh đẻ vất vả, nguy cơ biến chứng ảnh hưởng tính mạng mẹ. Cần sinh ở cơ sở y tế có chuyên khoa.', 'bad'); score -= 4;
        } else if (rel.rel === 'a_sinh_b') {
          html += note('🟡 Mẹ sinh Bé: Ca sinh kéo dài, mẹ mất sức nhiều — vẫn an toàn nhưng cần hỗ trợ.'); score -= 1;
        } else if (rel.rel === 'b_sinh_a') {
          html += note('🟡 Bé sinh Mẹ: Bé mạnh khỏe, nhưng mẹ cần phục hồi lâu hơn sau sinh.'); score += 1;
        }
      }

      // Thiên Nhuế không vong
      if (isVoid(chart, pNhue)) { html += note('⭕ Thiên Nhuế Không Vong: Sức khỏe mẹ đang ổn, ít nguy hiểm.', 'good'); score += 1; }
    }

    // --- Cơ sở y tế ---
    html += section('🏥 Cơ Sở Y Tế (Thiên Xung)');
    const pXung = findPalaceByStarName(chart, 'Thiên Xung');
    if (pXung) {
      const rXung = analyzePalaceFull(pXung, 'Thiên Xung (Bệnh viện)', chart);
      html += rXung.html;
      if (pXung && pKhon) {
        const relHosp = getRelationBetweenPalaces(pXung, pKhon, chart);
        if (relHosp.rel === 'a_sinh_b') { html += note('🟢 Bệnh viện sinh trợ ca sinh: Đội ngũ y tế phù hợp, can thiệp kịp thời.', 'good'); score += 2; }
        else if (relHosp.rel === 'a_khac_b') { html += note('🔴 Bệnh viện khắc cung sinh: Cơ sở y tế này không phù hợp — cân nhắc chọn bệnh viện khác.', 'bad'); score -= 2; }
      }
      if (isVoid(chart, pXung)) { html += note('⭕ Bệnh viện Không Vong: Đội ngũ y tế không đủ sẵn sàng trong thời điểm này.', 'bad'); score -= 1; }
    }

    return { html, score };
  };

  // ===== CHỦ ĐỀ 21: SỨC KHỎE =====
  TOPIC_ANALYZERS[21] = function(chart) {
    let score = 0, html = '';
    const dayHS = getStemOf(chart, 'day');
    const hourHS = getStemOf(chart, 'hour');
    const pDay = findPalaceByHeavenlyStem(chart, dayHS);
    const pHour = findPalaceByHeavenlyStem(chart, hourHS);
    const pNhue = findPalaceByStarName(chart, 'Thiên Nhuế');
    const pTam = findPalaceByStarName(chart, 'Thiên Tâm');
    const pXung = findPalaceByStarName(chart, 'Thiên Xung');
    const pZS = getZhishiPalace(chart);
    const pSinh = findPalaceByGate(chart, 'Sinh');
    const pTu = findPalaceByGate(chart, 'Tu') || findPalaceByGate(chart, 'Tử');

    const MAP_BODY = {
      'Giáp':'Đầu, gan, túi mật','Ất':'Gan, túi mật, thực quản, cổ họng, thần kinh',
      'Bính':'Ruột non, môi, vai, trán (viêm)','Đinh':'Răng, tim, mắt',
      'Mậu':'Cơ bụng, bao tử, mũi','Kỷ':'Mắt, tỳ tạng, miệng, bụng',
      'Canh':'Xương, sườn, ruột già','Tân':'Phổi, phế quản, ngực, cổ',
      'Nhâm':'Tim mạch, bàng quang, máu','Quý':'Thần kinh, chân, thận'
    };

    // --- Người bệnh ---
    html += section('🧑 Người Bệnh (Can Ngày)');
    const rDay = analyzePalaceFull(pDay, `Người bệnh [${dayHS}]`, chart);
    html += rDay.html; score += rDay.score;

    if (pDay && isVoid(chart, pDay)) { html += note('⭕ Người bệnh Không Vong: Sức lực cạn kiệt, bệnh khó chữa hoặc bệnh nhân bỏ điều trị.', 'bad'); score -= 2; }

    // Xác định bộ phận dựa vào can ngày
    if (MAP_BODY[dayHS]) html += line(`Bộ phận liên quan (Can Ngày ${dayHS})`, MAP_BODY[dayHS], 'info');

    // --- Nguyên nhân bệnh (Can Giờ) ---
    html += section('🔬 Nguyên Nhân Bệnh (Can Giờ)');
    const rHour = analyzePalaceFull(pHour, `Can Giờ [${hourHS}] (Nguyên nhân)`, chart);
    html += rHour.html;
    if (MAP_BODY[hourHS]) html += line(`Bộ phận nguyên nhân [${hourHS}]`, MAP_BODY[hourHS], 'info');

    // --- Bệnh (Thiên Nhuế) ---
    html += section('🌡️ Bệnh Tình (Thiên Nhuế)');
    const rNhue = analyzePalaceFull(pNhue, 'Thiên Nhuế (Bệnh)', chart);
    html += rNhue.html;

    if (pNhue && pDay) {
      const rel = getRelationBetweenPalaces(pNhue, pDay, chart);
      html += line('Bệnh ↔ Người bệnh', rel.label, rel.rel === 'a_khac_b' ? 'bad' : rel.rel === 'b_khac_a' ? 'good' : 'neutral');
      if (rel.rel === 'a_khac_b') { html += note('🔴 Bệnh khắc Người: Bệnh đang tấn công mạnh, diễn biến xấu nhanh — KHẨN CẤP CẦU CỨU Y TẾ.', 'bad'); score -= 4; }
      else if (rel.rel === 'b_khac_a') { html += note('🟢 Người khắc Bệnh: Cơ thể đang kháng cự tốt, trên đà phục hồi.', 'good'); score += 3; }
      else if (rel.rel === 'a_sinh_b') { html += note('🔴 Bệnh sinh Người (nuôi dưỡng ngược): Bệnh ăn sâu, trở thành mãn tính.', 'bad'); score -= 2; }
      else if (rel.rel === 'b_sinh_a') { html += note('🟡 Người tương sinh bệnh: Bệnh dai dẳng, ổn định nhưng khó dứt điểm.'); score -= 1; }
    }
        if (pNhue && isVoid(chart, pNhue)) {
      html += note('⭕ Thiên Nhuế Không Vong: Bệnh giả hoặc mới chớm — dễ chữa, không đáng lo ngại.', 'good');
      score += 2;
    }
    if (pNhue && hasRuMu(pNhue)) {
      html += note('🪦 Thiên Nhuế Nhập Mộ: Bệnh ẩn sâu, khó chẩn đoán — cần xét nghiệm chuyên sâu.', 'bad');
      score -= 1;
    }

    // --- Thuốc / Điều trị ---
    html += section('💊 Phương Án Điều Trị');
    if (pTam) {
      const rTam = analyzePalaceFull(pTam, 'Thiên Tâm (Tây Y / Bác Sĩ)', chart);
      html += rTam.html;
      if (pNhue && pTam) {
        const relTreat = getRelationBetweenPalaces(pTam, pNhue, chart);
        if (relTreat.rel === 'a_khac_b') {
          html += note('🟢 Thuốc/bác sĩ khắc bệnh: Gặp đúng thầy đúng thuốc — điều trị dứt điểm.', 'good'); score += 2;
        } else {
          html += note('🟡 Thuốc chưa khắc được bệnh: Cân nhắc đổi phác đồ hoặc kết hợp Đông y.'); score -= 1;
        }
      }
      if (isVoid(chart, pTam)) { html += note('⭕ Thiên Tâm Không Vong: Bác sĩ/phương pháp tây y hiện tại chưa hiệu quả.', 'bad'); score -= 1; }
    }

    // Cơ sở y tế
    if (pXung) {
      html += line('Cơ Sở Y Tế (Thiên Xung)', palaceSummary(pXung, chart), isVoid(chart, pXung) ? 'bad' : 'good');
      if (isVoid(chart, pXung)) { html += note('⭕ Thiên Xung Không Vong: Bệnh viện/phòng khám này không phù hợp — nên chuyển viện.', 'bad'); score -= 1; }
    }

    // Đông y (Ất)
    const pAt21 = findPalaceByHeavenlyStem(chart, 'Ất');
    if (pAt21) {
      html += line('Đông Y (Ất)', palaceSummary(pAt21, chart), isVoid(chart, pAt21) ? 'bad' : 'good');
      if (isVoid(chart, pAt21)) { html += note('⭕ Ất Không Vong: Đông y, thuốc nam, châm cứu ít hiệu quả lúc này.', 'bad'); }
      else { html += note('🟢 Ất tốt: Đông y hoặc liệu pháp tự nhiên có thể hỗ trợ phục hồi tốt.', 'good'); score += 1; }
    }

    // --- Tiên lượng hồi phục ---
    html += section('📈 Tiên Lượng Hồi Phục');
    if (pZS) {
      html += line('Trực Sử (Tốc độ phục hồi)', palaceSummary(pZS, chart), 'info');
      if (isVoid(chart, pZS)) { html += note('⭕ Trực Sử Không Vong: Thời gian hồi phục không xác định, kéo dài.', 'bad'); score -= 1; }
      if (hasRuMu(pZS)) { html += note('🪦 Trực Sử Nhập Mộ: Hồi phục cực kỳ chậm, có thể trở thành bệnh mãn tính.', 'bad'); score -= 2; }
    }
    if (pDay && pSinh && pDay.cung === pSinh.cung) { html += note('🟢 Bản thân đồng cung Sinh Môn: Sinh lực mạnh, phục hồi nhanh chóng.', 'good'); score += 3; }
    if (pDay && pTu && pDay.cung === pTu.cung) { html += note('🔴 Bản thân đồng cung Tử Môn: Bệnh nặng, hồi phục rất chậm và khó khăn.', 'bad'); score -= 3; }

    // Chỉ dấu phẫu thuật / u bướu
    html += section('🔬 Chỉ Dấu Đặc Biệt');
    const pDinh21 = findPalaceByHeavenlyStem(chart, 'Đinh');
    const pKhai21 = findPalaceByGate(chart, 'Khai');
    const pMau21 = findPalaceByHeavenlyStem(chart, 'Mậu');
    const pBinh21 = findPalaceByHeavenlyStem(chart, 'Bính');
    const pNhamQuy21 = findPalaceByHeavenlyStem(chart, 'Nhâm') || findPalaceByHeavenlyStem(chart, 'Quý');

    if (pDinh21 && pKhai21 && pDinh21.cung === pDay?.cung) {
      html += note('⚕️ Đinh + Khai Môn đồng cung người bệnh: Dấu hiệu đã hoặc sắp phẫu thuật.', 'bad'); score -= 1;
    }
    if (pMau21 && (hasRuMu(pMau21) || isVoid(chart, pMau21))) {
      html += note('⚠️ Mậu/Kỷ bất thường: Nghi ngờ u bướu, nang, sẹo tiềm ẩn — cần siêu âm kiểm tra.', 'bad'); score -= 1;
    }
    if (pBinh21 && pBinh21.cung === pDay?.cung) {
      html += note('🌡️ Bính đồng cung người bệnh: Có dấu hiệu viêm nhiễm, sốt.', 'bad'); score -= 1;
    }
    if (pNhamQuy21 && getEffectiveDeityName(pNhamQuy21, chart).includes('Bạch Hổ')) {
      html += note('🩸 Nhâm/Quý + Bạch Hổ: Vấn đề về máu huyết, huyết áp hoặc chấn thương.', 'bad'); score -= 1;
    }

    return { html, score };
  };

  // ===== CHỦ ĐỀ 22: KIỆN TỤNG =====
  TOPIC_ANALYZERS[22] = function(chart) {
    let score = 0, html = '';
    const dayHS = getStemOf(chart, 'day');
    const pDay = findPalaceByHeavenlyStem(chart, dayHS);
    const pKhai = findPalaceByGate(chart, 'Khai');
    const pCanh = findPalaceByGate(chart, 'Cảnh');
    const pDo = findPalaceByGate(chart, 'Đỗ');
    const pKinh = findPalaceByGate(chart, 'Kinh');
    const pZF = getZhifuPalace(chart);
    const pTS = getZhishiPalace(chart);
    const pLH = findPalaceByDeityName(chart, 'Lục Hợp');
    const pDinh = findPalaceByHeavenlyStem(chart, 'Đinh');
    const pBinh = findPalaceByHeavenlyStem(chart, 'Bính');

    // --- Người hỏi ---
    html += section('🧑 Người Hỏi (Can Ngày)');
    const rDay = analyzePalaceFull(pDay, `Can Ngày [${dayHS}]`, chart);
    html += rDay.html; score += rDay.score;

    // --- Quan Tòa (Khai Môn) ---
    html += section('⚖️ Quan Tòa / Phán Quyết (Khai Môn)');
    const rKhai = analyzePalaceFull(pKhai, 'Khai Môn (Quan Tòa)', chart);
    html += rKhai.html;

    if (pKhai && pDay) {
      const rel = getRelationBetweenPalaces(pKhai, pDay, chart);
      if (rel.rel === 'a_sinh_b') { html += note('🟢 Tòa ủng hộ bên này: Phán quyết có lợi — XÁC SUẤT THẮNG KIỆN CAO.', 'good'); score += 4; }
      else if (rel.rel === 'a_khac_b') { html += note('🔴 Tòa bất lợi cho bên này: Phán quyết nghiêng về phía đối phương.', 'bad'); score -= 3; }
      else if (rel.rel === 'b_khac_a') { html += note('🟡 Bên này đang tác động lên tòa: Có thể vận động được nhưng cần thêm bằng chứng.'); score += 1; }
    }
    if (pKhai && isVoid(chart, pKhai)) { html += note('⭕ Khai Môn Không Vong: Thiếu chứng cứ, tòa chưa thể phân xử — vụ kiện bị treo.', 'bad'); score -= 3; }
    if (pKhai && hasRuMu(pKhai)) { html += note('🪦 Khai Môn Nhập Mộ: Phiên tòa bị hoãn vô thời hạn.', 'bad'); score -= 2; }
    if (pKhai && hasPattern(pKhai, 'phục ngâm')) { html += note('⏸️ Khai Môn Phục Ngâm: Vụ kiện kéo dài nhiều năm không có hồi kết.', 'bad'); score -= 2; }
    if (pKhai && hasPattern(pKhai, 'phản ngâm')) { html += note('🔄 Khai Môn Phản Ngâm: Phiên tòa bị dời ngày, thay đổi thẩm phán hoặc địa điểm.'); score -= 1; }

    // --- Đơn kiện (Cảnh Môn) ---
    html += section('📋 Đơn Khởi Kiện (Cảnh Môn)');
    const rCanhKT = analyzePalaceFull(pCanh, 'Cảnh Môn (Đơn kiện)', chart);
    html += rCanhKT.html;
    if (pKhai && pCanh) {
      const relKC = getRelationBetweenPalaces(pKhai, pCanh, chart);
      if (relKC.rel === 'a_khac_b') { html += note('🔴 Tòa khắc Đơn kiện: ĐƠN BỊ BÁC — Tòa không thụ lý hoặc trả đơn.', 'bad'); score -= 3; }
      else if (relKC.rel === 'a_sinh_b') { html += note('🟢 Tòa chấp nhận đơn: Vụ kiện được thụ lý chính thức.', 'good'); score += 2; }
    }
    if (pCanh && isVoid(chart, pCanh)) { html += note('⭕ Cảnh Môn Không Vong: Đơn kiện thiếu căn cứ pháp lý hoặc có nội dung không trung thực.', 'bad'); score -= 2; }
    const dCanh22 = pCanh ? getEffectiveDeityName(pCanh, chart) : '';
    if (dCanh22.includes('Huyền Vũ') || dCanh22.includes('Đằng Xà')) {
      html += note('🔴 Cảnh Môn + Huyền Vũ/Đằng Xà: Nội dung đơn kiện có thể sai sự thật hoặc bị làm giả.', 'bad'); score -= 2;
    }

    // --- Bằng chứng (Lục Hợp) ---
    html += section('🔍 Bằng Chứng & Nhân Chứng (Lục Hợp)');
    const rLH22 = analyzePalaceFull(pLH, 'Lục Hợp (Bằng chứng)', chart);
    html += rLH22.html;
    if (pLH && isVoid(chart, pLH)) { html += note('⭕ Lục Hợp Không Vong: Bằng chứng không đủ, nhân chứng không đáng tin — hồ sơ yếu.', 'bad'); score -= 2; }
    if (pLH && hasRuMu(pLH)) { html += note('🪦 Lục Hợp Nhập Mộ: Bằng chứng bị phong tỏa, nhân chứng từ chối hợp tác.', 'bad'); score -= 2; }
    if (pLH && !isVoid(chart, pLH) && !hasRuMu(pLH)) { html += note('🟢 Lục Hợp tốt: Có bằng chứng rõ ràng và nhân chứng hợp tác.', 'good'); score += 2; }

    // --- Luật sư (Kinh Môn) ---
    html += section('👨‍⚖️ Luật Sư (Kinh Môn)');
    if (pKinh) {
      const rKinh = analyzePalaceFull(pKinh, 'Kinh Môn (Luật sư)', chart);
      html += rKinh.html;
      if (isVoid(chart, pKinh)) { html += note('⭕ Kinh Môn Không Vong: Luật sư thiếu năng lực hoặc không nhiệt tình với vụ kiện.', 'bad'); score -= 1; }
      else { html += note('🟢 Luật sư có thực lực, hỗ trợ tốt cho vụ kiện.', 'good'); score += 1; }
    }

    // --- Viện kiểm sát (Đỗ Môn) ---
    html += section('🏛️ Viện Kiểm Sát (Đỗ Môn)');
    if (pDo) {
      const rDo22 = analyzePalaceFull(pDo, 'Đỗ Môn (Viện kiểm sát)', chart);
      html += rDo22.html;
    }

    // --- Giấy tờ / bằng chứng số ---
    html += section('📁 Giấy Tờ & Bằng Chứng Số');
    if (pDinh) {
      html += line('Đinh (Giấy tờ / lệnh triệu tập)', palaceSummary(pDinh, chart), isVoid(chart, pDinh) ? 'bad' : 'good');
      if (isVoid(chart, pDinh)) { html += note('⭕ Đinh Không Vong: Giấy tờ pháp lý thiếu sót, lệnh triệu tập không hợp lệ.', 'bad'); score -= 1; }
    }
    if (pBinh) {
      html += line('Bính (Bằng chứng hình ảnh/video)', palaceSummary(pBinh, chart), isVoid(chart, pBinh) ? 'bad' : 'good');
      if (isVoid(chart, pBinh)) { html += note('⭕ Bính Không Vong: Bằng chứng hình ảnh không rõ ràng hoặc đã bị xóa.', 'bad'); score -= 1; }
      else { html += note('🟢 Có bằng chứng hình ảnh/video rõ ràng — lợi thế lớn trong phiên tòa.', 'good'); score += 1; }
    }

    // --- Nguyên cáo và bị cáo ---
    html += section('⚔️ Thế Lực Hai Phía');
    if (pZF) {
      const rZF22 = analyzePalaceFull(pZF, 'Trực Phù (Nguyên cáo)', chart);
      html += rZF22.html;
      if (pDay && pZF) {
        if (pDay.cung === pZF.cung) { html += note('🟢 Bạn là Nguyên cáo — đang ở thế chủ động trong vụ kiện.', 'good'); score += 1; }
      }
    }
    if (pTS) {
      const rTS22 = analyzePalaceFull(pTS, 'Trực Sử (Bị cáo)', chart);
      html += rTS22.html;
      if (pTS && isVoid(chart, pTS)) { html += note('⭕ Bị cáo Không Vong: Đối phương thiếu thực lực bào chữa — lợi thế cho bên khởi kiện.', 'good'); score += 1; }
    }

    return { html, score };
  };

  // ===== CHỦ ĐỀ 23: TỐ TỤNG HÌNH SỰ =====
  TOPIC_ANALYZERS[23] = function(chart) {
    let score = 0, html = '';
    const pTan = findPalaceByHeavenlyStem(chart, 'Tân');
    const pMau = findPalaceByHeavenlyStem(chart, 'Mậu');
    const pNhue = findPalaceByStarName(chart, 'Thiên Nhuế');
    const monthHS = getStemOf(chart, 'month');
    const pMonth = findPalaceByHeavenlyStem(chart, monthHS);
    const pLH = findPalaceByDeityName(chart, 'Lục Hợp');
    const pThuong = findPalaceByGate(chart, 'Thương');
    const pDo = findPalaceByGate(chart, 'Đỗ');

    // --- Tội phạm (Tân) ---
    html += section('🚔 Tội Phạm / Nghi Phạm (Tân)');
    if (!pTan) {
      html += note('Không xác định được vị trí Tân — nghi phạm đang ẩn mình hoặc chưa lộ diện.', 'neutral');
      return { html, score: 0 };
    }
    const rTan = analyzePalaceFull(pTan, 'Tân (Tội phạm)', chart);
    html += rTan.html;

    // --- Loại tội danh theo thần ---
    html += section('📋 Loại Tội Danh & Hành Vi');
    const deityTan = getEffectiveDeityName(pTan, chart);
    const gateTan = pTan.batMon || '';

    if (deityTan.includes('Huyền Vũ')) { html += note('💰 Huyền Vũ: Tội danh liên quan đến TRỘM CẮP, THAM Ô, CHIẾM ĐOẠT tài sản.', 'bad'); score -= 2; }
    if (deityTan.includes('Đằng Xà')) { html += note('🎭 Đằng Xà: Tội danh LỪA ĐẢO, GIẢ MẠO, GIAN LẬN tài chính.', 'bad'); score -= 2; }
    if (deityTan.includes('Bạch Hổ')) { html += note('⚔️ Bạch Hổ: Tội danh BẠO LỰC, CỐ Ý GÂY THƯƠNG TÍCH, đe dọa tính mạng.', 'bad'); score -= 2; }
    if (deityTan.includes('Câu Trận')) { html += note('⛓️ Câu Trận: Bị bắt giữ, giam cầm — đang trong vòng kiểm soát của pháp luật.', 'bad'); score -= 1; }

    if (normalizeGateName(gateTan) === 'Thương' || gateTan === 'Thương Môn') {
      html += note('🤜 Thương Môn: Có liên quan đến ĐÁNH NHAU, gây thương tích.', 'bad'); score -= 1;
    }
    if (normalizeGateName(gateTan) === 'Đỗ') {
      html += note('🔒 Đỗ Môn: Đang bị giam cầm, không thể thoát khỏi vòng vây pháp lý.', 'bad'); score -= 2;
    }
    if (normalizeGateName(gateTan) === 'Tử') {
      html += note('💀 Tử Môn: Tội danh rất nặng, nguy cơ án tù dài hạn.', 'bad'); score -= 3;
    }

    // --- Mức độ tội ---
    html += section('⚖️ Mức Độ Tội & Kết Quả Pháp Lý');
    if (hasPattern(pTan, 'Lục Nghi Kích Hình')) {
      html += note('🔴 Tân Kích Hình: TỘI DANH CỰC NẶNG — Hình phạt nghiêm khắc, khó thoát khỏi vòng tố tụng.', 'bad'); score -= 4;
    }

    // Tân gặp Nhâm/Quý → đi tù
    const pNhamQuy23 = findPalaceByHeavenlyStem(chart, 'Nhâm') || findPalaceByHeavenlyStem(chart, 'Quý');
    if (pNhamQuy23 && pNhamQuy23.cung === pTan.cung) {
      html += note('🏛️ Tân gặp Nhâm/Quý đồng cung: XÁC SUẤT ĐI TÙ rất cao.', 'bad'); score -= 3;
    }

    // Tân gặp Mậu → vì tiền mà họa
    if (pMau && pMau.cung === pTan.cung) {
      html += note('💵 Tân + Mậu đồng cung: Phạm tội VÌ TIỀN — tham lam tài chính là động cơ chính.', 'bad'); score -= 2;
    }

    // Tân không vong → dễ thoát
    if (isVoid(chart, pTan)) {
      html += note('⭕ Tân Không Vong: Bằng chứng chống lại nghi phạm yếu — CÓ KHẢ NĂNG ĐƯỢC TẠI NGOẠI hoặc giảm án.', 'good'); score += 3;
    }

    // Tân nhập mộ → đang bị giam
    if (hasRuMu(pTan)) {
      html += note('🪦 Tân Nhập Mộ: Đang bị giam giữ chặt chẽ, không có khả năng tại ngoại.', 'bad'); score -= 2;
    }

    // Phản/phục ngâm
    if (hasPattern(pTan, 'phản ngâm')) {
      html += note('🔄 Phản Ngâm: CÓ KHẢ NĂNG ĐƯỢC PHÓNG THÍCH sớm hoặc đảo ngược tình thế bất ngờ.', 'good'); score += 2;
    }
    if (hasPattern(pTan, 'phục ngâm')) {
      html += note('⏸️ Phục Ngâm: Vụ án kéo dài, BẮT GIỮ KÉO DÀI không có tiến triển.', 'bad'); score -= 1;
    }

    // Dịch mã → có khả năng bỏ trốn
    if (isHorse(chart, pTan)) {
      html += note('🐎 Tân có Dịch Mã: NGHI PHẠM CÓ THỂ BỎ TRỐN — cần theo dõi và kiểm soát chặt.', 'bad'); score -= 2;
    }

    // --- Đồng bọn ---
    html += section('👥 Khả Năng Đồng Bọn');
    if (pLH && pLH.cung === pTan.cung) {
      html += note('🔴 Lục Hợp đồng cung Tân: CÓ ĐỒNG BỌN — vụ án có tổ chức, không phạm tội đơn lẻ.', 'bad'); score -= 2;
    }
    if (pMonth && pMonth.cung === pTan.cung) {
      html += note('🔴 Can Tháng đồng cung Tân: Có người quen hoặc đồng nghiệp liên đới.', 'bad'); score -= 1;
    }
    if (!pLH || pLH.cung !== pTan.cung) {
      html += note('🟡 Không có dấu hiệu đồng bọn rõ ràng — có thể phạm tội đơn độc.', 'neutral');
    }

    // --- Tóm tắt hình sự ---
    html += section('📊 Kết Luận Hình Sự');
    const totalHungSignals = (hasPattern(pTan, 'Lục Nghi Kích Hình') ? 1 : 0) +
      (hasRuMu(pTan) ? 1 : 0) +
      (deityTan.includes('Huyền Vũ') || deityTan.includes('Đằng Xà') || deityTan.includes('Bạch Hổ') ? 1 : 0);

    if (totalHungSignals >= 2) {
      html += verdict('❌ Tội danh rõ ràng và nặng — án phạt cao, ít khả năng giảm nhẹ.', 'bad');
    } else if (isVoid(chart, pTan)) {
      html += verdict('✅ Bằng chứng yếu — có thể được tại ngoại hoặc giảm án đáng kể.', 'good');
    } else {
      html += verdict('⚠️ Tội danh ở mức trung bình — kết quả phụ thuộc vào luật sư và bằng chứng.', 'warn');
    }

    return { html, score };
  };

  // ===== CHỦ ĐỀ 24: ĐI LẠC =====
  TOPIC_ANALYZERS[24] = function(chart) {
    let score = 0, html = '';
    const dayHS = getStemOf(chart, 'day');
    const hourHS = getStemOf(chart, 'hour');
    const pDay = findPalaceByHeavenlyStem(chart, dayHS);
    const pHour = findPalaceByHeavenlyStem(chart, hourHS);
    const pLH = findPalaceByDeityName(chart, 'Lục Hợp');
    const pDo = findPalaceByGate(chart, 'Đỗ');
    const pZF = getZhifuPalace(chart);
    const pTS = getZhishiPalace(chart);

    // --- Người đi lạc (Can Giờ) ---
    html += section('🧭 Người Đi Lạc (Can Giờ — Dụng Thần)');
    const rHour = analyzePalaceFull(pHour, `Can Giờ [${hourHS}] (Người lạc)`, chart);
    html += rHour.html;

    // --- Khả năng tìm lại ---
    html += section('🔍 Khả Năng Tìm Thấy');
    if (pDay && pHour && pDay.cung === pHour.cung) {
      html += note('🟢 Ngày Giờ Đồng Cung: SẼ TÌM THẤY HOẶC TỰ QUAY VỀ — xác suất rất cao.', 'good'); score += 4;
    }

    if (hasGlobalPattern(chart, 'phản ngâm')) {
      html += note('🔄 Cục Phản Ngâm: CHẮC CHẮN SẼ QUAY LẠI — chỉ cần kiên nhẫn chờ đợi.', 'good'); score += 3;
    }
    if (hasGlobalPattern(chart, 'phục ngâm')) {
      html += note('⏸️ Cục Phục Ngâm: KHÓ TÌM THẤY — người lạc đang bị mắc kẹt hoặc không muốn quay về.', 'bad'); score -= 3;
    }

    if (pHour && isVoid(chart, pHour)) {
      html += note('⭕ Can Giờ Không Vong: Người lạc đang ở nơi trống vắng, vắng người — khó tìm thấy.', 'bad'); score -= 2;
    }
    if (pHour && hasRuMu(pHour)) {
      html += note('🪦 Can Giờ Nhập Mộ: Người lạc đang bị "phong tỏa" — bị giam giữ hoặc ẩn nấp kỹ.', 'bad'); score -= 2;
    }
    if (pHour && isHorse(chart, pHour)) {
      html += note('🐎 Can Giờ có Dịch Mã: Người lạc đang di chuyển liên tục — khó xác định vị trí cố định.', 'bad'); score -= 1;
    }

    // --- Thần đi kèm → tình trạng người lạc ---
    html += section('⚠️ Tình Trạng Người Đi Lạc');
    const deityHour24 = pHour ? getEffectiveDeityName(pHour, chart) : '';
    if (deityHour24.includes('Huyền Vũ')) { html += note('🔴 Huyền Vũ: Người lạc BỊ NGƯỜI KHÁC LỪA DẪN đi — không tự ý rời đi.', 'bad'); score -= 2; }
    if (deityHour24.includes('Đằng Xà')) { html += note('🔴 Đằng Xà: Người lạc BỊ BẮT GIỮ hoặc đang trong trạng thái hoảng loạn, sợ hãi.', 'bad'); score -= 2; }
    if (deityHour24.includes('Bạch Hổ')) { html += note('🔴 Bạch Hổ: NGUY HIỂM — Người lạc có thể đang bị đe dọa hoặc đã bị thương.', 'bad'); score -= 3; }
    if (deityHour24.includes('Cửu Địa') || deityHour24.includes('Thái Âm')) {
      html += note('🔴 Cửu Địa / Thái Âm: Có người đang CẤT GIẤU hoặc che chở người lạc một cách bí mật.', 'bad'); score -= 1;
    }
    if (deityHour24.includes('Lục Hợp')) { html += note('🟢 Lục Hợp: Người lạc đang gặp được người tốt, có thể đang được giúp đỡ để tìm đường về.', 'good'); score += 1; }
    if (deityHour24.includes('Trực Phù')) { html += note('🟢 Trực Phù: Người lạc đang được bảo vệ, an toàn — sẽ sớm được tìm thấy.', 'good'); score += 2; }

    // --- Hướng tìm kiếm ---
    html += section('🗺️ Hướng Tìm Kiếm');
    if (pLH) {
      const dir = palaceDirection(pLH.cung, chart);
      const cung = palaceName(pLH.cung, chart);
      html += note(`📍 Lục Hợp ở hướng ${dir} (Cung ${cung}): Đây là hướng người lạc BAN ĐẦU đi theo — bắt đầu tìm kiếm từ đây.`);
    }
    if (pDo) {
      const dir = palaceDirection(pDo.cung, chart);
      const cung = palaceName(pDo.cung, chart);
      html += note(`📍 Đỗ Môn ở hướng ${dir} (Cung ${cung}): Hướng người lạc có thể đang ẨN NÁU hoặc di chuyển đến.`);
    }
    if (pHour) {
      const dir = palaceDirection(pHour.cung, chart);
      const cung = palaceName(pHour.cung, chart);
      html += note(`📍 Can Giờ (Dụng thần) ở hướng ${dir} (Cung ${cung}): Vị trí hiện tại nghi vấn — ưu tiên tìm kiếm khu vực này.`);
    }

    // --- Điểm dừng chân ---
    html += section('🏠 Điểm Dừng Chân (Trực Phù / Trực Sử)');
    if (pZF) {
      html += line('Trực Phù', `Cung ${palaceName(pZF.cung, chart)} — Hướng ${palaceDirection(pZF.cung, chart)}`, 'info');
    }
    if (pTS) {
      html += line('Trực Sử', `Cung ${palaceName(pTS.cung, chart)} — Hướng ${palaceDirection(pTS.cung, chart)}`, 'info');
    }

    return { html, score };
  };

  // ===== CHỦ ĐỀ 25: MẤT ĐỒ =====
  TOPIC_ANALYZERS[25] = function(chart) {
    let score = 0, html = '';
    const dayHS = getStemOf(chart, 'day');
    const hourHS = getStemOf(chart, 'hour');
    const pDay = findPalaceByHeavenlyStem(chart, dayHS);
    const pHour = findPalaceByHeavenlyStem(chart, hourHS);
    const pHuyenVu = findPalaceByDeityName(chart, 'Huyền Vũ');
    const pThienBong = findPalaceByStarName(chart, 'Thiên Bồng');

    // --- Vật mất (Can Giờ) ---
    html += section('📦 Vật Bị Mất (Can Giờ)');
    const rHour = analyzePalaceFull(pHour, `Can Giờ [${hourHS}] (Vật mất)`, chart);
    html += rHour.html;

    // --- Khả năng tìm lại ---
    html += section('🔍 Khả Năng Tìm Lại');
    if (pDay && pHour && pDay.cung === pHour.cung) {
      html += note('🟢 Ngày Giờ Đồng Cung: ĐỒ VẬT CHƯA MẤT THẬT SỰ — loanh quanh đâu đó, nhìn kỹ sẽ thấy ngay.', 'good'); score += 4;
    }

    if (hasGlobalPattern(chart, 'phản ngâm')) {
      html += note('🔄 Cục Phản Ngâm: ĐỒ ĐI RỒI LẠI VỀ — sẽ tìm lại được hoặc người khác trả lại.', 'good'); score += 3;
    }
    if (hasGlobalPattern(chart, 'phục ngâm')) {
      html += note('⏸️ Cục Phục Ngâm: Khó tìm lại — đồ đang nằm im một chỗ nhưng khó phát hiện.'); score -= 1;
    }

    if (pHour && isVoid(chart, pHour)) {
      html += note('⭕ Vật Mất Không Vong: MẤT THẬT RỒI — khả năng tìm lại gần như bằng 0. Hãy chấp nhận và báo cáo.', 'bad'); score -= 4;
    }
    if (pHour && hasRuMu(pHour)) {
      html += note('🪦 Vật Mất Nhập Mộ: Đồ bị chôn giấu hoặc cất kỹ — rất khó tìm, cần thêm manh mối.', 'bad'); score -= 2;
    }

    // Vượng suy của Can Giờ
    const gsHour = pHour ? getGrowthStage(pHour, hourHS, chart) : '';
    if (['Đế Vượng','Trường Sinh','Lâm Quan'].includes(gsHour)) {
      html += note(`🟢 Can Giờ đang ${gsHour}: Vật mất còn nguyên vẹn, chưa bị phá hủy.`, 'good'); score += 1;
    } else if (['Tử','Mộ','Tuyệt'].includes(gsHour)) {
      html += note(`🔴 Can Giờ đang ${gsHour}: Vật mất có thể đã bị hư hỏng hoặc tiêu tán.`, 'bad'); score -= 1;
    }

    // --- Trong hay ngoài ---
    html += section('📍 Vị Trí Mất Đồ (Nội/Ngoại Bàn)');
    const sys = chart.sys;
    if (pDay && pHour && sys) {
      const dayInner = sys.NOI_BAN.includes(pDay.cung);
      const hourInner = sys.NOI_BAN.includes(pHour.cung);
      if (dayInner && hourInner) {
        html += note('🏠 Cả hai cung đều thuộc NỘI BÀN: Đồ mất trong nhà, trong phòng gần bạn.', 'good'); score += 1;
      } else if (!dayInner && !hourInner) {
        html += note('🌍 Cả hai cung thuộc NGOẠI BÀN: Đồ mất ở bên ngoài, xa nơi ở.'); score -= 1;
      } else {
        html += note('🔀 Nội ngoại hỗn hợp: Đồ mất ở vùng ranh giới — cửa ra vào, sân, xe, hoặc nơi công cộng gần nhà.'); score += 0;
      }
    }

    // --- Ai lấy ---
    html += section('🕵️ Ai Đã Lấy?');
    if (pHuyenVu) {
      const dHuyenVu = getEffectiveDeityName(pHuyenVu, chart);
      if (pHuyenVu.cung === pHour?.cung) {
        html += note('🔴 Huyền Vũ đồng cung vật mất: CÓ NGƯỜI LẤY TRỘM — không phải để quên.', 'bad'); score -= 2;
        // Xác định giới tính kẻ trộm
        const hsBong = getHeavenlyStem(pHuyenVu);
        const isYangStemBong = ['Giáp','Bính','Mậu','Canh','Nhâm'].includes(hsBong);
        if (isYangStemBong) {
          html += note('👨 Thiên Can Dương tại Huyền Vũ: Người lấy có thể là ĐÀN ÔNG.'); 
        } else {
          html += note('👩 Thiên Can Âm tại Huyền Vũ: Người lấy có thể là PHỤ NỮ.');
        }
      } else {
        html += note(`⚠️ Huyền Vũ ở Cung ${palaceName(pHuyenVu.cung, chart)} (${palaceDirection(pHuyenVu.cung, chart)}): Kẻ trộm có liên quan đến khu vực hướng này.`, 'bad'); score -= 1;
      }
    }

    if (pThienBong && pHour && pThienBong.cung === pHour.cung) {
      html += note('🔴 Thiên Bồng đồng cung vật mất: Đồ bị lấy trộm trong hoàn cảnh hỗn loạn, đông người.', 'bad'); score -= 2;
    }

    // Không có dấu hiệu trộm cắp
    if (!pHuyenVu || pHuyenVu.cung !== pHour?.cung) {
      if (!pThienBong || pThienBong.cung !== pHour?.cung) {
        html += note('🟡 Không có dấu hiệu rõ ràng của kẻ trộm — có thể BẠN TỰ ĐỂ QUÊN ở đâu đó.'); score += 1;
      }
    }

    // --- Hướng tìm kiếm ---
    html += section('🗺️ Hướng Tìm Kiếm');
    if (pHour) {
      html += note(`📍 Can Giờ (Vật mất) ở hướng ${palaceDirection(pHour.cung, chart)} — Cung ${palaceName(pHour.cung, chart)}: Tìm kiếm theo hướng này trước.`);
    }
    if (pHuyenVu && pHuyenVu.cung !== pHour?.cung) {
      html += note(`📍 Huyền Vũ ở hướng ${palaceDirection(pHuyenVu.cung, chart)}: Kẻ tình nghi có thể đến từ hoặc ở về hướng này.`);
    }

    return { html, score };
  };

  // ===== CHỦ ĐỀ 26: THỜI TIẾT =====
  TOPIC_ANALYZERS[26] = function(chart) {
    let score = 0, html = '';

    const WSTEM = {
      'Giáp':'Gió','Ất':'Gió','Bính':'Nóng','Đinh':'Nóng',
      'Mậu':'Mây','Kỷ':'Mây','Canh':'Lạnh','Tân':'Lạnh',
      'Nhâm':'Mưa','Quý':'Mưa'
    };
    const WSTAR = {
      'Thiên Anh':'Nắng','Thiên Phụ':'Gió','Thiên Trụ':'Mưa',
      'Thiên Bồng':'Mưa','Thiên Xung':'Sấm','Thiên Nhuế':'Mây',
      'Thiên Nhậm':'Mưa','Thiên Tâm':'Nắng','Thiên Cầm':'Mây'
    };
    const WDEITY = {
      'Trực Phù':'Nắng','Cửu Thiên':'Nắng','Thái Âm':'Mây',
      'Cửu Địa':'Mây','Huyền Vũ':'Mưa','Lục Hợp':'Gió',
      'Bạch Hổ':'Gió','Đằng Xà':'Nóng'
    };

    const wc = {};
    const addW = (type, source) => {
      if (!type) return;
      if (!wc[type]) wc[type] = { count: 0, sources: [] };
      wc[type].count++;
      wc[type].sources.push(source);
    };

    html += section('☁️ Quét Tín Hiệu Khí Tượng');

    for (const p of getAllPalaces(chart)) {
      const hs = p.thienCanBan || '';
      const db = p.diaBan || '';
      const star = p.thienBan || '';
      const deity = getEffectiveDeityName(p, chart);
      const cungName = palaceName(p.cung, chart);

      if (WSTEM[hs]) addW(WSTEM[hs], `Can ${hs} (Cung ${cungName})`);
      if (WSTEM[db]) addW(WSTEM[db], `ĐB ${db} (Cung ${cungName})`);
      for (const [sn, wt] of Object.entries(WSTAR)) {
        if (star && star.includes(sn)) { addW(wt, `Sao ${sn} (${cungName})`); break; }
      }
      for (const [dn, wt] of Object.entries(WDEITY)) {
        if (deity && deity.includes(dn)) { addW(wt, `Thần ${deity} (${cungName})`); break; }
      }
    }

    const sorted = Object.entries(wc).sort((a, b) => b[1].count - a[1].count);

    if (!sorted.length) {
      html += note('Không đủ dữ liệu để dự báo thời tiết.', 'neutral');
      return { html, score: 0 };
    }

    // Hiển thị thống kê
    for (const [w, data] of sorted) {
      const emoji = { 'Mưa':'🌧️','Nắng':'☀️','Gió':'💨','Nóng':'🌡️','Lạnh':'❄️','Mây':'☁️','Sấm':'⛈️' }[w] || '🌤️';
      const type = data.count >= 4 ? 'bad' : data.count >= 2 ? 'neutral' : 'neutral';
      html += line(
        `${emoji} ${w}`,
        `${data.count} chỉ dấu — ${data.sources.slice(0, 3).join(', ')}${data.sources.length > 3 ? '...' : ''}`,
        type
      );
    }

    // --- Dự báo chính ---
    html += section('📊 Dự Báo Thời Tiết Chính');
    const main = sorted[0];
    const second = sorted[1];

    const emojiMap = { 'Mưa':'🌧️','Nắng':'☀️','Gió':'💨','Nóng':'🌡️','Lạnh':'❄️','Mây':'☁️','Sấm':'⛈️' };
    html += note(`${emojiMap[main[0]] || '🌤️'} YẾU TỐ THỐNG TRỊ: ${main[0].toUpperCase()} (${main[1].count} lần xuất hiện). Đây là điều kiện thời tiết chủ đạo.`,
      main[0] === 'Mưa' || main[0] === 'Sấm' ? 'bad' : 'good');

    if (second && second[1].count >= Math.ceil(main[1].count * 0.6)) {
      html += note(`${emojiMap[second[0]] || '🌤️'} YẾU TỐ PHỤ: ${second[0]} cũng khá mạnh — thời tiết hỗn hợp, có thể thay đổi trong ngày.`);
    }

    // Kiểm tra tín hiệu mưa đặc biệt
    html += section('⚡ Phân Tích Tín Hiệu Đặc Biệt');
    const pBong26 = findPalaceByStarName(chart, 'Thiên Bồng');
    const pTru26 = findPalaceByStarName(chart, 'Thiên Trụ');
    const pNhamQuy26 = findPalaceByHeavenlyStem(chart, 'Nhâm') || findPalaceByHeavenlyStem(chart, 'Quý');
    const waterCungs = [1]; // Khảm = Thủy

    let rainSignals = 0;
    if (wc['Mưa'] && wc['Mưa'].count >= 3) { html += note('🌧️ Mưa xuất hiện nhiều lần — XÁC SUẤT MƯA RẤT CAO.', 'bad'); rainSignals++; }
    if (pBong26 && pNhamQuy26 && pBong26.cung === pNhamQuy26.cung) { html += note('🌧️ Thiên Bồng + Nhâm/Quý đồng cung: DẤU HIỆU MƯA MẠNH.', 'bad'); rainSignals++; }
    if (pTru26 && pNhamQuy26 && pTru26.cung === pNhamQuy26.cung) { html += note('🌧️ Thiên Trụ + Nhâm/Quý đồng cung: DẤU HIỆU MƯA KÉO DÀI.', 'bad'); rainSignals++; }

    if (wc['Sấm'] && wc['Sấm'].count >= 1) { html += note('⛈️ Thiên Xung xuất hiện: Có thể có sấm chớp, giông bão.', 'bad'); rainSignals++; }

    if (rainSignals === 0 && (!wc['Mưa'] || wc['Mưa'].count < 2)) {
      if (wc['Nắng'] && wc['Nắng'].count >= 2) {
        html += note('☀️ Tín hiệu Nắng áp đảo: Thời tiết khô ráo, quang đãng.', 'good');
      }
    }

    // Tổng kết thời tiết theo mùa
    const mua = chart.season?.mua || '';
    html += section('📅 Bối Cảnh Theo Mùa');
    const muaCtx = {
      'Xuân': 'Mùa Xuân: Thường có mưa phùn, độ ẩm cao.',
      'Hạ': 'Mùa Hạ: Nắng nóng chủ đạo, dễ có giông chiều.',
      'Thu': 'Mùa Thu: Khí hậu mát mẻ, gió se.',
      'Đông': 'Mùa Đông: Lạnh, có thể có sương mù hoặc mưa.'
    };
    if (muaCtx[mua]) html += note(`🗓️ ${muaCtx[mua]}`);

    return { html, score: 0 };
  };

  // ============================ KÍCH HOẠT VÀ XỬ LÝ SỰ KIỆN ============================
  function runAnalysis(chartArg) {
    const select = document.getElementById('topicSelect');
    const topicId = select ? select.value : '';
    const resultDiv = document.getElementById('analysisResult');

    if (!topicId) {
      if (resultDiv) resultDiv.innerHTML = '<div style="color:var(--text-muted);text-align:center;padding:20px;font-family:sans-serif;">Vui lòng chọn chủ đề để luận giải.</div>';
      return;
    }
    const chart = chartArg || getCurrentChart();
    if (!chart) {
      if (resultDiv) resultDiv.innerHTML = '<div style="color:red;padding:20px;">Chưa có dữ liệu. Hãy bấm "Lập Bàn" trước.</div>';
      return;
    }

    try {
      const fn = TOPIC_ANALYZERS[Number(topicId)];
      if (!fn) { if (resultDiv) resultDiv.innerHTML = '<div style="color:red;">Lỗi: Không tìm thấy bộ phân tích chủ đề này.</div>'; return; }
      const analysisObj = fn(chart);
      const finalHtml = analysisObj.html + summarizeResult(analysisObj.score);
      if (resultDiv) resultDiv.innerHTML = finalHtml;
    } catch (e) {
      console.error('[LogicLuanQue Error]', e);
      if (resultDiv) resultDiv.innerHTML = `<div style="color:red;font-weight:bold;padding:20px;">Lỗi xử lý: ${e.message}. Xem Console để biết thêm.</div>`;
    }
  }

  function bindUIEvents() {
    const select = document.getElementById('topicSelect');
    if (select) {
      select.addEventListener('change', function () {
        const topicId = this.value;
        const guideDiv = document.getElementById('topicGuide');
        if (guideDiv) {
          guideDiv.innerHTML = TOPIC_GUIDES[topicId]
            ? renderTopicGuide(topicId)
            : '<div style="color:var(--text-muted);text-align:center;padding:40px 0;font-family:sans-serif;">Chọn chủ đề để xem hướng dẫn</div>';
        }
        runAnalysis();
      });
    }
    const reBtn = document.getElementById('btnReAnalyze');
    if (reBtn) reBtn.addEventListener('click', () => runAnalysis());
    const clearBtn = document.getElementById('btnClearNote');
    const noteArea = document.getElementById('analysisNote');
    if (clearBtn && noteArea) clearBtn.addEventListener('click', () => { noteArea.value = ''; });
  }

  function bindChartEvents() {
    if (window.ChartEvents) window.ChartEvents.on('chartCalculated', (chart) => runAnalysis(chart));
  }

  function initLogicLuanQue() {
    bindUIEvents();
    bindChartEvents();
    if (window.__LAST_CHART) {
      runAnalysis(window.__LAST_CHART);
      const select = document.getElementById('topicSelect');
      if (select && select.value) {
        const guideDiv = document.getElementById('topicGuide');
        if (guideDiv) guideDiv.innerHTML = TOPIC_GUIDES[select.value] ? renderTopicGuide(select.value) : '';
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLogicLuanQue);
  } else {
    initLogicLuanQue();
  }

})();
