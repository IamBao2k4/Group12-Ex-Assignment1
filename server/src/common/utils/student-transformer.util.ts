import { Student } from '../../student/interfaces/student.interface';
import { IDDocument } from '../../student/interfaces/id-document.interface';
import { FacultyService } from '../../faculty/services/faculty.service';
import { ProgramService } from '../../program/services/program.service';
import { Schema } from 'mongoose';

export class StudentTransformer {

  static toExcelRow(student: Student | any): any {
    const idDoc = student.giay_to_tuy_than && student.giay_to_tuy_than.length > 0 
      ? student.giay_to_tuy_than[0] 
      : null;
    
    const khoaTen = student.khoa_ten || 
      (student.khoa && typeof student.khoa === 'object' ? student.khoa.ten_khoa : student.khoa);
    
    const khoaMa = student.khoa_ma || 
      (student.khoa && typeof student.khoa === 'object' ? student.khoa.ma_khoa : '');
    
    const chuongTrinhTen = student.chuong_trinh_ten || 
      (student.chuong_trinh && typeof student.chuong_trinh === 'object' ? student.chuong_trinh.name : student.chuong_trinh);
    
    const chuongTrinhMa = student.chuong_trinh_ma || 
      (student.chuong_trinh && typeof student.chuong_trinh === 'object' ? student.chuong_trinh.ma : '');
    
    const tinhTrangTen = student.tinh_trang_ten || 
      (student.tinh_trang && typeof student.tinh_trang === 'object' ? student.tinh_trang.tinh_trang : student.tinh_trang);
    
    return {
      'Mã số sinh viên': student.ma_so_sinh_vien,
      'Họ tên': student.ho_ten,
      'Ngày sinh': student.ngay_sinh,
      'Giới tính': student.gioi_tinh,
      'Mã khoa': khoaMa,
      'Khoa': khoaTen,
      'Khóa học': student.khoa_hoc,
      'Mã chương trình': chuongTrinhMa,
      'Chương trình': chuongTrinhTen,
      'Email': student.email || '',
      'Số điện thoại': student.so_dien_thoai || '',
      'Tình trạng': tinhTrangTen,
      'Địa chỉ chi tiết': student.dia_chi_thuong_tru?.chi_tiet || '',
      'Phường/Xã': student.dia_chi_thuong_tru?.phuong_xa || '',
      'Quận/Huyện': student.dia_chi_thuong_tru?.quan_huyen || '',
      'Tỉnh/Thành phố': student.dia_chi_thuong_tru?.tinh_thanh_pho || '',
      'Quốc gia': student.dia_chi_thuong_tru?.quoc_gia || '',
      'Loại giấy tờ': idDoc?.type || '',
      'Số giấy tờ': idDoc?.so || '',
      'Ngày cấp': idDoc?.ngay_cap || '',
      'Nơi cấp': idDoc?.noi_cap || '',
      'Quốc gia cấp': idDoc?.type === 'passport' ? idDoc?.quoc_gia_cap || '' : '',
      'Có gắn chip': idDoc?.type === 'cccd' ? idDoc['co_gan_chip'] || '' : '',
      'Ngày hết hạn': idDoc?.ngay_het_han || '',
      'Ngày tạo': student.created_at ? new Date(student.created_at).toLocaleString() : '',
      'Ngày cập nhật': student.updated_at ? new Date(student.updated_at).toLocaleString() : '',
    };
  }


  static async fromExcelRow(
    row: any, 
    facultyService: FacultyService,
    programService: ProgramService
  ): Promise<Partial<Student>> {
    const khoaMa = row['Mã khoa'] || row.ma_khoa;
    const chuongTrinhMa = row['Mã chương trình'] || row.ma_chuong_trinh;

    let khoaId: Schema.Types.ObjectId | undefined;
    let chuongTrinhId: Schema.Types.ObjectId | undefined;

    if (khoaMa) {
      const faculty = await facultyService.findByCode(khoaMa);
      if (faculty && faculty._id) {
        khoaId = faculty._id as Schema.Types.ObjectId;
      }
    }

    if (chuongTrinhMa) {
      const program = await programService.findByCode(chuongTrinhMa);
      if (program && program._id) {
        chuongTrinhId = program._id as Schema.Types.ObjectId;
      }
    }

    const idDoc: IDDocument = {
      type: row['Loại giấy tờ'] || row.loai_giay_to || '',
      so: row['Số giấy tờ'] || row.so_giay_to || '',
      ngay_cap: row['Ngày cấp'] || row.ngay_cap || null,
      noi_cap: row['Nơi cấp'] || row.noi_cap || '',
      ngay_het_han: row['Ngày hết hạn'] || row.ngay_het_han || null,
    };

    if ((idDoc as any).type === 'cccd') {
      (idDoc as any).co_gan_chip = row['Có gắn chip'] || row.co_gan_chip || false;
    }

    const diaChiThuongTru = {
      chi_tiet: row['Địa chỉ chi tiết'] || row.dia_chi_chi_tiet || '',
      phuong_xa: row['Phường/Xã'] || row.phuong_xa || '',
      quan_huyen: row['Quận/Huyện'] || row.quan_huyen || '',
      tinh_thanh_pho: row['Tỉnh/Thành phố'] || row.tinh_thanh_pho || '',
      quoc_gia: row['Quốc gia'] || row.quoc_gia || 'Việt Nam',
    };

    return {
      ma_so_sinh_vien: row['Mã số sinh viên'] || row.ma_so_sinh_vien,
      ho_ten: row['Họ tên'] || row.ho_ten,
      ngay_sinh: row['Ngày sinh'] || row.ngay_sinh,
      gioi_tinh: row['Giới tính'] || row.gioi_tinh,
      khoa: khoaId,
      khoa_hoc: row['Khóa học'] || row.khoa_hoc,
      chuong_trinh: chuongTrinhId,
      email: row['Email'] || row.email,
      so_dien_thoai: row['Số điện thoại'] || row.so_dien_thoai,
      dia_chi_thuong_tru: diaChiThuongTru,
      giay_to_tuy_than: [idDoc],
    };
  }
} 