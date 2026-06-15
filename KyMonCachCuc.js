// KyMonCachCuc.js - Động cơ xử lý Cách Cục (Tốt/Xấu) cho Kỳ Môn Độn Giáp
// Tách biệt khỏi Core Engine để dễ dàng thêm bớt quy tắc sau này.

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

  // Hàm quét và chấm toàn bộ các Cách Cục
  function kiemTra(tb, db, bm, bt, tcb, sys, utils) {
    const { tuongSinh, tuongKhac, biKhac, danhSachSaoTaiCung, NGU_HANH_SAO } = utils;
    
    const palacePatterns = {};
    for (let c = 1; c <= 9; c++) palacePatterns[c] = [];
    const auspicious = [], inauspicious = [], seen = {};
    
    const push = (cung, pattern) => {
      const key = cung + ':' + pattern.ten;
      if (seen[key]) return;
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

      // Xét Ngâm
      if (sao === sys.SAO_THEO_CUNG[cung] && mon === sys.MON_THEO_CUNG[cung] && cung !== 5) push(cung, { ten:'Phục Ngâm', cung, loai:'hung' });
      const cx = sys.CUNG_XUNG[cung];
      if (cx && sao === sys.SAO_THEO_CUNG[cx] && (bm[cx] || '') === sys.MON_THEO_CUNG[cung] && cung !== 5) push(cung, { ten:'Phản Ngâm', cung, loai:'hung' });
      
      // Xét Ngũ Hành Tương Tác
      if (tuongSinh(hs, hc)) push(cung, { ten:'Sao Sinh Cung', cung, loai:'cat' });
      if (tuongKhac(hs, hc)) push(cung, { ten:'Sao Khắc Cung', cung, loai:'hung' });
      if (tuongSinh(hm, hc) && hm) push(cung, { ten:'Môn Sinh Cung', cung, loai:'cat' });
      if (tuongKhac(hm, hc) && hm) push(cung, { ten:'Môn Bức Cung', cung, loai:'hung' });
      if (biKhac(hm, hc) && hm)    push(cung, { ten:'Cung Chế Môn', cung, loai:'hung' });
      
      // Xét Các Tam Độn / Ngũ Giả
      if (than === 'Cửu Thiên' && mon === 'Sinh'  && dsSao.includes('Thiên Tâm'))  push(cung, { ten:'Thiên Độn', cung, loai:'cat' });
      if (than === 'Cửu Địa'   && mon === 'Khai'  && dsSao.includes('Thiên Nhậm')) push(cung, { ten:'Địa Độn', cung, loai:'cat' });
      if (than === 'Thái Âm'   && mon === 'Hưu'   && dsSao.includes('Thiên Bồng')) push(cung, { ten:'Nhân Độn', cung, loai:'cat' });
      if (than === 'Lục Hợp'   && mon === 'Khai') push(cung, { ten:'Phong Độn', cung, loai:'cat' });
      if (than === 'Lục Hợp'   && mon === 'Sinh') push(cung, { ten:'Vân Độn', cung, loai:'cat' });
      
      if (dsSao.includes('Thiên Nhuế') && mon === 'Tử') push(cung, { ten:'Thiên Nhuế Tử Môn', cung, loai:'hung' });
      
      if (tamKy.includes(ct) && catMon.includes(mon)) push(cung, { ten:'Hưu Trá', cung, loai:'cat' });
      if (tamKy.includes(ct) && than === 'Cửu Thiên') push(cung, { ten:'Thiên Giả', cung, loai:'cat' });
      if (tamKy.includes(ct) && than === 'Cửu Địa')   push(cung, { ten:'Địa Giả', cung, loai:'cat' });
      
      // Khác
      if (ct === 'Mậu'  && cd === 'Bính' && sys.THANH_LONG_CUNG.includes(cung)) push(cung, { ten:'Thanh Long Phản Thủ', cung, loai:'cat' });
      if (ct === 'Bính' && cd === 'Mậu'  && sys.THANH_LONG_CUNG.includes(cung)) push(cung, { ten:'Phi Điểu Điệt Huyệt', cung, loai:'cat' });
      if (dsSao.includes('Thiên Cầm') && ['Khai','Hưu','Sinh','Cảnh'].includes(mon)) push(cung, { ten:'Thiên Cầm Tứ Trương', cung, loai:'cat' });
      if (ct === 'Ất' && mon === 'Hưu') push(cung, { ten:'Ất Kỳ Đắc Sử', cung, loai:'cat' });
    }

    // Lục Nghi Kích Hình
    const lnkh = tinhLucNghiKichHinh(db, sys);
    for (const item of lnkh) push(item.cung, { ten:'Lục Nghi Kích Hình', cung:item.cung, loai:'hung', desc:item.desc });

    return { auspicious, inauspicious, palacePatterns };
  }

  return { kiemTra };
}));
