// KyMonCachCuc.js - Động cơ xử lý Cách Cục (Tốt/Xấu) cho Kỳ Môn Độn Giáp
// Tách biệt khỏi Core Engine để dễ dàng thêm bớt quy tắc sau này.
// Tích hợp Đầy đủ Thập Can Khắc Ứng, Tam Kỳ Đắc Sử, Thiên Can Hợp từ Logic AI

(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory();
  } else {
    root.KyMonCachCuc = factory();
  }
}(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  // Hàm tính Lục Nghi Kích Hình (được chuyển từ Engine sang)
  function tinhLucNghiKichHinh(diaBan, sys) {
    const result = [];
    for (let c = 1; c <= 9; c++) {
      if (c === 5 && !diaBan[5]) continue;
      const can = diaBan[c] || '', chiCung = sys.CHI_CHINH_CUNG[c] || '';
      for (const rule of sys.LUC_NGHI_KICH_HINH) {
        if (can === rule.can && rule.cungHD.includes(c)) {
          result.push({ cung: c, can, chiCung, loai: 'hung', desc: `Lục Nghi kích hình: ${rule.desc}` });
        }
      }
    }
    return result;
  }

  // ==================== TỪ ĐIỂN CÁCH CỤC BỔ SUNG ====================
  // Bổ sung 15 bộ Thập Can Khắc Ứng từ Bảng Luận Quẻ chuyên sâu
  const THAP_CAN_KHAC_UNG = {
    'Mậu+Bính': { loai: 'cat', ten: 'Thanh Long Phản Thủ' },
    'Bính+Mậu': { loai: 'cat', ten: 'Phi Điểu Điệt Huyệt' },
    'Canh+Canh': { loai: 'hung', ten: 'Thái Bạch Đồng Cung' },
    'Canh+Nhâm': { loai: 'hung', ten: 'Di Lạc Thoái Vị' },
    'Nhâm+Canh': { loai: 'hung', ten: 'Thái Bạch Cầm Xà' },
    'Đinh+Quý': { loai: 'hung', ten: 'Chu Tước Đầu Giang' },
    'Quý+Đinh': { loai: 'hung', ten: 'Đằng Xà Yểu Kiều' },
    'Canh+Bính': { loai: 'hung', ten: 'Thái Bạch Nhập Huỳnh' },
    'Bính+Canh': { loai: 'hung', ten: 'Huỳnh Hoặc Bột Thái Bạch' },
    'Tân+Ất': { loai: 'hung', ten: 'Bạch Hổ Xương Cuồng' },
    'Ất+Tân': { loai: 'hung', ten: 'Thanh Long Đào Tẩu' },
    'Nhâm+Nhâm': { loai: 'hung', ten: 'Thiên La Võng Trương' },
    'Quý+Quý': { loai: 'hung', ten: 'Thiên Võng Tứ Trương' },
    'Mậu+Mậu': { loai: 'hung', ten: 'Phục Ngâm Mậu Mậu' },
    'Giáp+Canh': { loai: 'hung', ten: 'Phi Bồng Sát' }
  };

  // Bổ sung các cặp Thiên Can Tương Hợp
  const THIEN_CAN_HOP = {
    'Giáp':'Kỷ','Kỷ':'Giáp', 
    'Ất':'Canh','Canh':'Ất', 
    'Bính':'Tân','Tân':'Bính', 
    'Đinh':'Nhâm','Nhâm':'Đinh', 
    'Mậu':'Quý','Quý':'Mậu'
  };

  // Hàm quét và chấm toàn bộ các Cách Cục
  function kiemTra(tb, db, bm, bt, tcb, sys, utils) {
    const { tuongSinh, tuongKhac, biKhac, danhSachSaoTaiCung, NGU_HANH_SAO } = utils;
    
    const palacePatterns = {};
    for (let c = 1; c <= 9; c++) palacePatterns[c] = [];
    const auspicious = [], inauspicious = [], seen = {};
    
    const push = (cung, pattern) => {
      const key = cung + ':' + pattern.ten;
      if (seen[key]) return; // Tránh trùng lặp cách cục trong cùng 1 cung
      seen[key] = true; 
      palacePatterns[cung].push(pattern);
      if (pattern.loai === 'cat') auspicious.push(pattern); 
      else inauspicious.push(pattern);
    };

    const tamKy = ['Ất', 'Bính', 'Đinh'], catMon = ['Khai', 'Hưu', 'Sinh'];

    for (let cung = 1; cung <= 9; cung++) {
      if (cung === 5 && !tb[5]) continue; 
      
      const sao = tb[cung] || '', mon = bm[cung] || '', than = bt[cung] || '', ct = tcb[cung] || '', cd = db[cung] || '';
      const hc = sys.CUNG_META[cung]?.hanh || '', hs = NGU_HANH_SAO[sao] || '', hm = sys.NGU_HANH_MON[mon] || '';
      const dsSao = danhSachSaoTaiCung(tb, cung);

      // 1. Xét Ngâm (Cũ)
      if (sao === sys.SAO_THEO_CUNG[cung] && mon === sys.MON_THEO_CUNG[cung] && cung !== 5) push(cung, { ten:'Phục Ngâm', cung, loai:'hung' });
      const cx = sys.CUNG_XUNG[cung];
      if (cx && sao === sys.SAO_THEO_CUNG[cx] && (bm[cx] || '') === sys.MON_THEO_CUNG[cung] && cung !== 5) push(cung, { ten:'Phản Ngâm', cung, loai:'hung' });
      
      // 2. Xét Ngũ Hành Tương Tác (Cũ)
      if (tuongSinh(hs, hc)) push(cung, { ten:'Sao Sinh Cung', cung, loai:'cat' });
      if (tuongKhac(hs, hc)) push(cung, { ten:'Sao Khắc Cung', cung, loai:'hung' });
      if (tuongSinh(hm, hc) && hm) push(cung, { ten:'Môn Sinh Cung', cung, loai:'cat' });
      if (tuongKhac(hm, hc) && hm) push(cung, { ten:'Môn Bức Cung', cung, loai:'hung' });
      if (biKhac(hm, hc) && hm)    push(cung, { ten:'Cung Chế Môn', cung, loai:'hung' });
      
      // 3. Xét Các Tam Độn / Ngũ Giả (Cũ)
      if (than === 'Cửu Thiên' && mon === 'Sinh'  && dsSao.includes('Thiên Tâm'))  push(cung, { ten:'Thiên Độn', cung, loai:'cat' });
      if (than === 'Cửu Địa'   && mon === 'Khai'  && dsSao.includes('Thiên Nhậm')) push(cung, { ten:'Địa Độn', cung, loai:'cat' });
      if (than === 'Thái Âm'   && mon === 'Hưu'   && dsSao.includes('Thiên Bồng')) push(cung, { ten:'Nhân Độn', cung, loai:'cat' });
      if (than === 'Lục Hợp'   && mon === 'Khai') push(cung, { ten:'Phong Độn', cung, loai:'cat' });
      if (than === 'Lục Hợp'   && mon === 'Sinh') push(cung, { ten:'Vân Độn', cung, loai:'cat' });
      
      if (dsSao.includes('Thiên Nhuế') && mon === 'Tử') push(cung, { ten:'Thiên Nhuế Tử Môn', cung, loai:'hung' });
      
      if (tamKy.includes(ct) && catMon.includes(mon)) push(cung, { ten:'Hưu Trá', cung, loai:'cat' });
      if (tamKy.includes(ct) && than === 'Cửu Thiên') push(cung, { ten:'Thiên Giả', cung, loai:'cat' });
      if (tamKy.includes(ct) && than === 'Cửu Địa')   push(cung, { ten:'Địa Giả', cung, loai:'cat' });
      
      // 4. Các cấu trúc cũ đặc biệt
      if (ct === 'Mậu'  && cd === 'Bính' && sys.THANH_LONG_CUNG.includes(cung)) push(cung, { ten:'Thanh Long Phản Thủ', cung, loai:'cat' });
      if (ct === 'Bính' && cd === 'Mậu'  && sys.THANH_LONG_CUNG.includes(cung)) push(cung, { ten:'Phi Điểu Điệt Huyệt', cung, loai:'cat' });
      if (dsSao.includes('Thiên Cầm') && ['Khai','Hưu','Sinh','Cảnh'].includes(mon)) push(cung, { ten:'Thiên Cầm Tứ Trương', cung, loai:'cat' });
      if (ct === 'Ất' && mon === 'Hưu') push(cung, { ten:'Ất Kỳ Đắc Sử', cung, loai:'cat' });

      // ==================== ĐOẠN BỔ SUNG MỚI (TỪ LOGIC AI CHUYÊN GIA) ====================
      
      // 5. Xét Thập Can Khắc Ứng (Thiên Bàn + Địa Bàn)
      if (ct && cd) {
        const canPair = ct + '+' + cd;
        if (THAP_CAN_KHAC_UNG[canPair]) {
          push(cung, { 
            ten: THAP_CAN_KHAC_UNG[canPair].ten, 
            cung: cung, 
            loai: THAP_CAN_KHAC_UNG[canPair].loai 
          });
        }

        // 6. Xét Thiên Can Tương Hợp (Duyên phận kết dính)
        if (THIEN_CAN_HOP[ct] === cd) {
          push(cung, { 
            ten: 'Thiên Can Tương Hợp', 
            cung: cung, 
            loai: 'cat' 
          });
        }
      }

      // 7. Xét Tam Kỳ Đắc Sử (Tam Kỳ đi kèm Cát Môn)
      if (tamKy.includes(ct) && catMon.includes(mon)) {
        push(cung, { 
          ten: 'Tam Kỳ Đắc Sử', 
          cung: cung, 
          loai: 'cat' 
        });
      }
      
      // ====================================================================================
    }

    // 8. Xét Lục Nghi Kích Hình (Chạy quét Địa Bàn)
    const lnkh = tinhLucNghiKichHinh(db, sys);
    for (const item of lnkh) push(item.cung, { ten:'Lục Nghi Kích Hình', cung:item.cung, loai:'hung', desc:item.desc });

    return { auspicious, inauspicious, palacePatterns };
  }

  return { kiemTra };
}));
