const fp = require("fastify-plugin");
const { Parser } = require("@json2csv/plainjs");
const { Buffer } = require("node:buffer");
const FormData = require("form-data");
const {
  getAuthToken
} = require("@kovai-pazhamudir-nilayam/kpn-platform-token");

const DEFAULT_PARSER_OPTIONS = {
  fields: [
    { label: "Department", value: "department_category_name" },
    { label: "Subclass", value: "subclass_name" },
    { label: "SKU Code", value: "ksin" },
    { label: "KPN Title", value: "kpn_product_name" },
    { label: "KPN Price", value: "kpn_price" },
    { label: "KPN URL", value: "kpn_url" },

    { label: "Zepto Title", value: "zepto_product_name" },
    { label: "Zepto Price", value: "zepto_price" },
    { label: "Zepto URL", value: "zepto_url" },
    { label: "Zepto Price Updated At", value: "zepto_price_updated_at" },

    { label: "BigBasket Title", value: "big_basket_product_name" },
    { label: "BigBasket Price", value: "big_basket_price" },
    { label: "BigBasket URL", value: "big_basket_url" },
    {
      label: "BigBasket Price Updated At",
      value: "big_basket_price_updated_at"
    },

    { label: "BlinkIt Title", value: "blinkit_product_name" },
    { label: "BlinkIt Price", value: "blinkit_price" },
    { label: "BlinkIt URL", value: "blinkit_url" },
    { label: "BlinkIt Price Updated At", value: "blinkit_price_updated_at" },

    { label: "Instamart Title", value: "instamart_product_name" },
    { label: "Instamart Price", value: "instamart_price" },
    { label: "Instamart URL", value: "instamart_url" },
    { label: "Instamart Price Updated At", value: "instamart_price_updated_at" }
  ]
};

const artifactServicePlugin = async fastify => {
  async function convertJSONToCsvFileAndUploadToArtifact({
    logTrace,
    inputData,
    csv_file_name,
    csv_parser_options = DEFAULT_PARSER_OPTIONS
  }) {
    const csvParser = new Parser(csv_parser_options);
    const filename = `${csv_file_name}.csv`;
    const csvData = csvParser.parse(inputData);
    const file = Buffer.from(csvData);

    const createArtifactInput = new FormData();

    createArtifactInput.append("file", file, filename);

    const authToken = await getAuthToken("PLATFORM");

    const url = `${fastify.config.CORE_ARTIFACT_SERVICE_URI}/v1/media/upload?artifact_config_id=${fastify.config.CORE_ARTIFACT_CONFIG_ID}`;

    const boundary = createArtifactInput.getBoundary();

    const result = await fastify.request({
      url,
      method: "POST",
      body: createArtifactInput,
      headers: {
        Authorization: authToken,
        ...logTrace
      },
      downstream_system: "core-artifact",
      path: "/v1/media/upload/:artifact_config_id",
      functionality: "Upload Price Report File",
      source_system: "core-price-processor",
      domain: "Price",
      contentType: `multipart/form-data;boundary=${boundary}`
    });
    return {
      media_url: result.media_url,
      download_media_url: result.download_media_url
    };
  }

  fastify.decorate(
    "convertJSONToCsvFileAndUploadToArtifact",
    convertJSONToCsvFileAndUploadToArtifact
  );
};

module.exports = fp(artifactServicePlugin);
