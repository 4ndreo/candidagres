import "./StoreProduct.css";
import { Link } from "react-router-dom";
import { Card } from "react-bootstrap";

// Cloudinary
import { AdvancedImage } from "@cloudinary/react";
import { Cloudinary } from "@cloudinary/url-gen";
import { auto } from "@cloudinary/url-gen/actions/resize";
import { autoGravity } from "@cloudinary/url-gen/qualifiers/gravity";

export function StoreProduct({ props }) {
  const item = props.item;

  const renderImage = (item) => {
    const cld = new Cloudinary({ cloud: { cloudName: process.env.REACT_APP_CLOUDINARY_CLOUD_NAME } });
    const img = cld
      .image(`products/${item.img}`)
      .format('auto')
      .quality('auto')
      .resize(auto().gravity(autoGravity()));
    return (
      <AdvancedImage cldImg={img} className="card-img" alt={item?.description} />
    )
  }

  return (

    <Card className="store-product-cont">
      <div className="card-img-cont">
        {renderImage(item)}
        {/* <Card.Img className="card-img" variant="top" src={item.img ? SERVER_URL + "uploads/" + item.img : ImagePlaceholder} /> */}
      </div>
      <Card.Body>
        <div className="d-flex flex-column justify-content-between ">
          <Link to={`/store/item/${item._id}`} className="stretched-link"><span className="card-title">{item.title}</span></Link>
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-md-3">
            <span className="badge text-bg-primary card-material">{item.material}</span>
            <Card.Text className="card-price">
              ${item.price}
            </Card.Text>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}
