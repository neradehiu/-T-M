import { IsNotEmpty, IsPhoneNumber } from 'class-validator';

export class CreateOrderDto {
  @IsNotEmpty({ message: 'Tên người nhận không được để trống' })
  shippingName: string;

  // đơn giản: kiểm tra là string không rỗng, không bắt buộc dùng IsPhoneNumber(VN)
  @IsNotEmpty({ message: 'Số điện thoại không được để trống' })
  shippingPhone: string;

  @IsNotEmpty({ message: 'Địa chỉ giao hàng không được để trống' })
  shippingAddress: string;
}
