"use client";
import { ProductImage } from "@/app/components/common/ProductImage";
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
    text: "tặng thời gian bảo hành 6 tháng",
  },
  {
    icon: <img src="/icons/refund.png" alt="Hoàn tiền" className="w-8 h-8" />,
    text: "Hoàn tiền và tặng giày nếu phát hiện hàng FAKE",
  },
  {
    icon: <img src="/icons/service.png" alt="Tiêu chuẩn" className="w-8 h-8" />,
    text: "Bảo hành keo chỉ 1 tháng",
  },
  {
    icon: <img src="/icons/battery.png" alt="Pin" className="w-8 h-8" />,
    text: "Thay pin miễn phí suốt đời",
  },
  {
    icon: <img src="/icons/shipping.png" alt="Giao hàng" className="w-8 h-8" />,
    text: "Giao hàng toàn quốc",
  },
  {
    icon: <img src="/icons/thirty.png" alt="Kinh nghiệm" className="w-8 h-8" />,
    text: "Đổi trả hàng trong 30 ngày đầu",
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
    {/*Khối hình ảnh sản phẩm + thông tin sản phẩm*/}
      <div className="container mx-auto flex flex-col md:flex-row items-start gap-[6rem] p-10 justify-center">
        {/* Khối trái: Hình + mô tả tách riêng */}
        <div className="w-96 flex flex-col gap-4">
          {/* Hình sản phẩm (luôn có khung cố định) */}
          <div className="w-full bg-gray-50 border rounded-lg flex items-center justify-center min-h-[300px]">
            {product.image ? (
              <ProductImage src={product.image} />
            ) : (
              <span className="text-gray-400 text-sm italic">
                Không có hình ảnh sản phẩm
              </span>
            )}
          </div>

          {/* Mô tả sản phẩm (có khung riêng, không phụ thuộc hình) */}
          <div className="bg-white border rounded-lg p-4 shadow-sm">
            <h2 className="font-bold mb-2 text-gray-800">Mô tả sản phẩm:</h2>
            <p className="text-gray-600 leading-relaxed text-[16px]">
              {product.description || "Không có mô tả cho sản phẩm này."}
            </p>
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
          {/* size giay */}
          <div className="mt-2 flex items-center gap-2">
            <span className="font-semibold text-gray-700">Size:</span>
            <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-md">
              {product.shoeSize}
            </span>
          </div>
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

          <div className="bg-gray-50 border rounded-lg p-4 shadow-sm mt-4">
            <h2 className="font-bold mb-2 text-gray-800 text-xl">
              Ưu đãi áp dụng đến 2025:
            </h2>
            <ul className="list-disc ml-4 pl-6 space-y-1 text-gray-600 leading-relaxed text-[16px]">
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
