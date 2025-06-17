"use client";
import { ProductImage } from "@/app/components/common/base-64-image";
import { ProductDetailsResponse, UserProductControllerService } from "@/gen";
import { useAuth } from "@/lib/hooks/use-auth";
import { useCart } from "@/lib/hooks/use-cart";
import { formatVND } from "@/util/currency";
import { redirectAuthenticateAndGoBack } from "@/util/route";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

type BenefitItem = {
  icon: React.ReactNode;
  text: string;
};

const benefits: BenefitItem[] = [
  {
    icon: <img src="/icons/warranty.png" alt="Bảo hành" className="w-8 h-8" />,
    text: "Tăng thời gian bảo hành lên đến 5 năm",
  },
  {
    icon: <img src="/icons/refund.png" alt="Hoàn tiền" className="w-8 h-8" />,
    text: "Hoàn tiền gấp 10 lần khi phát hiện hàng giả",
  },
  {
    icon: <img src="/icons/service.png" alt="Tiêu chuẩn" className="w-8 h-8" />,
    text: "Trung tâm bảo hành đạt tiêu chuẩn quốc tế - Xem Thêm",
  },
  {
    icon: <img src="/icons/battery.png" alt="Pin" className="w-8 h-8" />,
    text: "Thay pin miễn phí suốt đời",
  },
  {
    icon: <img src="/icons/shipping.png" alt="Giao hàng" className="w-8 h-8" />,
    text: "Giao hàng siêu tốc 2h hoặc COD miễn phí",
  },
  {
    icon: <img src="/icons/thirty.png" alt="Kinh nghiệm" className="w-8 h-8" />,
    text: "Kinh nghiệm và dịch vụ hơn 30 năm",
  },
];

export default function ProductDetailsPage() {
  const params = useParams();
  const id = Number(params?.id); // Lấy ID từ URL
  const [product, setProduct] = useState<ProductDetailsResponse | null>(null);
  const { isAuthenticated } = useAuth();
  const [quantity, setQuantity] = useState(1);

  const { addToCart } = useCart();

  useEffect(() => {
    //Fetch dữ liệu từ database
    const fertchProduct = async () => {
      try {
        const res = await UserProductControllerService.getProductById1(id);
        setProduct(res);
      } catch (err) {
        console.log("Lỗi khi fetch sản phẩm", err);
      }
    };
    fertchProduct();
  }, []);

  if (!product) {
    return (
      <p className="text-center text-red-500 text-xl">
        Sản phẩm không tồn tại!
      </p>
    );
  }

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      redirectAuthenticateAndGoBack();
      toast("Vui lòng đăng nhập !");
    } else {
      if (!product.isActive) {
        toast.error("Sản phẩm đã ngừng kinh doanh !");
      } else {
        if (quantity > (product.stock ?? 1)) {
          toast.error("Số lượng vượt quá tồn kho !");
        } else {
          addToCart({
            productId: product.productId,
            name: product.name,
            price: product.sellPrice,
            image: product.image,
            quantity: quantity,
          });
          toast.success("Thêm thành công");
        }
      }
    }
  };

  return (
    <>
      <div className="container mx-auto flex flex-col md:flex-row items-start gap-10 p-10 justify-center">
        {/* Hình ảnh sản phẩm */}
        <div className="w-96 flex flex-col ">
          <div className="flex flex-col items-center">
            <div className="mask mask-square">
              <ProductImage data={product.image} />
            </div>
          </div>
          {/* Mô tả sản phẩm */}
          <div className="mt-4 ml-2">
            <div className="">
              <h1 className="font-bold">Mô tả sản phẩm:</h1>

              <p className="text-[#abb8c3]">
                {product.description} Casio là thương hiệu lớn, được Anh Khuê
                (đối tác độc quyền của Casio tại Việt Nam) đảm nhận phân phối.
                Vì vậy, tất cả đồng hồ Casio đều phải được dán tem chống hàng
                giả từ Anh Khuê. Vì rất được ưa chuộng tại thị trường Việt Nam,
                tình trạng hàng giả, hàng nhái xảy ra phổ biến đối với Casio
                AE-1200WHD-1AVDF. Người dùng cần lưu ý những điều sau trước khi
                quyết định mua đồng hồ tại một cửa hiệu nào đó.
              </p>
            </div>
          </div>
        </div>

        {/* Thông tin sản phẩm */}
        <div className="flex flex-col max-w-lg">
          <h1 className="text-3xl font-bold uppercase">{product.name}</h1>
          <p className="text-gray-700 mt-2">
            <span className="font-bold text-xl text-gray">
              Thương hiệu: {product.brand?.name}
            </span>
          </p>
          <div className="mt-2">
            <p className="text-red-600 text-2xl font-bold">
              {formatVND(product.sellPrice)}
            </p>
          </div>
          {/* Số lượng thêm vào giỏ hàng */}
          <div className="mt-4 flex items-center gap-4">
            <div className="flex items-center border rounded">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-3 py-1 text-lg"
              >
                -
              </button>
              {quantity}
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="px-3 py-1 text-lg"
              >
                +
              </button>
            </div>
          </div>
          <button
            className="mt-3 bg-red-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-red-700"
            onClick={handleAddToCart}
          >
            THÊM VÀO GIỎ HÀNG
          </button>
          <div>
            {product.isActive ? (
              <p className="mt-3 text-gray-500">
                {" "}
                {product.stock} sản phẩm có sẵn
              </p>
            ) : (
              <p className="mt-3 text-gray-500">Sản phẩm ngừng kinh doanh !</p>
            )}
          </div>

          <div className="mt-4 text-m text-gray-600 bg-gray-200 rounded-lg">
            <div className=" text-xl font-bold border-b-4 p-2 border-white ">
              Ưu đãi áp dụng đến 2025:
            </div>
            <ul className="list-disc ml-4 pl-6 space-y-1 p-3">
              <li>Dịch vụ gói quà miễn phí khi mua hàng qua hotline</li>
              <li>
                Nhận tư vấn đặt hàng qua hotline{" "}
                <span className="font-bold">19008198</span>
              </li>
              <li>Chuyên viên hỗ trợ tư vấn khách hàng 24/7</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-[40px]">
        {benefits.map((benefit, index) => (
          <div
            key={index}
            className="flex items-center gap-3 p-4 border rounded-lg shadow-sm bg-white  "
          >
            <div className="text-red-600">{benefit.icon}</div>
            <p className="text-sm">{benefit.text}</p>
          </div>
        ))}
      </div>
    </>
  );
}
