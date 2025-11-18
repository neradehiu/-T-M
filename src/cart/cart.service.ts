import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CartItem } from './cart-item.entity';
import { Product } from '../products/product.entity';
import { User } from '../users/user.entity';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartItem)
    private readonly cartRepo: Repository<CartItem>,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  // Lấy giỏ hàng của user đang đăng nhập
  async getCart(userId: number) {
    const items = await this.cartRepo.find({
      where: { user: { id: userId } },
      relations: ['product'],
      order: { createdAt: 'DESC' },
    });

    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce(
      (sum, item) => sum + item.quantity * Number(item.product.price),
      0,
    );
    const selectedTotalPrice = items
      .filter((i) => i.selected)
      .reduce(
        (sum, item) => sum + item.quantity * Number(item.product.price),
        0,
      );

    return {
      items,
      totalItems,
      totalPrice,
      selectedTotalPrice,
    };
  }

  // Thêm sản phẩm vào giỏ
  async addToCart(userId: number, dto: AddToCartDto) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User không tồn tại');
    }

    const product = await this.productRepo.findOne({
      where: { id: dto.productId },
    });
    if (!product) {
      throw new NotFoundException('Sản phẩm không tồn tại');
    }

    // (OPTIONAL) kiểm tra tồn kho
    if (dto.quantity <= 0) {
      throw new BadRequestException('Số lượng phải lớn hơn 0');
    }

    // Nếu đã có cùng product trong giỏ → tăng thêm quantity
    let cartItem = await this.cartRepo.findOne({
      where: {
        user: { id: userId },
        product: { id: dto.productId },
      },
      relations: ['product', 'user'],
    });

    if (cartItem) {
      cartItem.quantity += dto.quantity;
    } else {
      cartItem = this.cartRepo.create({
        user,
        product,
        quantity: dto.quantity,
        selected: true, // mặc định thêm vào là được chọn
      });
    }

    const saved = await this.cartRepo.save(cartItem);
    return saved;
  }

  // Cập nhật số lượng / selected
  async updateItem(
    userId: number,
    cartItemId: number,
    dto: UpdateCartItemDto,
  ) {
    const cartItem = await this.cartRepo.findOne({
      where: { id: cartItemId, user: { id: userId } },
      relations: ['product'],
    });

    if (!cartItem) {
      throw new NotFoundException('Sản phẩm trong giỏ không tồn tại');
    }

    if (dto.quantity !== undefined) {
      if (dto.quantity < 1) {
        throw new BadRequestException('Số lượng phải >= 1');
      }
      cartItem.quantity = dto.quantity;
    }

    if (dto.selected !== undefined) {
      cartItem.selected = dto.selected;
    }

    const saved = await this.cartRepo.save(cartItem);
    return saved;
  }

  // Xoá 1 item khỏi giỏ
  async removeItem(userId: number, cartItemId: number) {
    const cartItem = await this.cartRepo.findOne({
      where: { id: cartItemId, user: { id: userId } },
    });

    if (!cartItem) {
      throw new NotFoundException('Sản phẩm trong giỏ không tồn tại');
    }

    await this.cartRepo.remove(cartItem);
    return { success: true };
  }
}
