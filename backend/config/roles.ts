import { AccessControl } from "accesscontrol";

const ac = new AccessControl();

ac.grant("customer")
  .readAny("product")
  .readAny("category")
  .createOwn("order")
  // Cart permissions
  .readOwn("cart")
  .createOwn("cart")
  .updateOwn("cart")
  .deleteOwn("cart")
  // Public permissions for new features
  .readAny("location")
  .readAny("bundle")
  .readAny("discount")
  .readAny("portfolioProject");

ac.grant("admin")
  .extend("customer") // Inherits customer rights
  .createAny("product")
  .updateAny("product")
  .deleteAny("product")
  .updateAny("inventory")
  .readAny("user")
  .createAny("user")
  .updateAny("user")
  .deleteAny("user")
  .readAny("order")
  .updateAny("order")
  .deleteAny("order")
  .readAny("orderAnalytics")
  // New feature permissions
  .createAny("location")
  .updateAny("location")
  .deleteAny("location")
  .createAny("bundle")
  .updateAny("bundle")
  .deleteAny("bundle")
  .createAny("discount")
  .updateAny("discount")
  .deleteAny("discount")
  .createAny("portfolioProject")
  .updateAny("portfolioProject")
  .deleteAny("portfolioProject")
  .readAny("customDesignRequest")
  .updateAny("customDesignRequest")
  .readAny("specialPieceRequest")
  .updateAny("specialPieceRequest")
  .readAny("consultationRequest")
  .updateAny("consultationRequest");

export default ac;
