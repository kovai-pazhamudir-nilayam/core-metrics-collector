const amountSchema = {
  $id: "response-amount",
  type: "object",
  properties: {
    currency: { type: "string" },
    cent_amount: { type: "integer" },
    fraction: { type: "integer" }
  }
};

const auditSchema = {
  $id: "response-audit",
  type: "object",
  properties: {
    api_version: { type: "string" },
    created_by: { type: "string" },
    created_at: { type: "string" },
    updated_by: { type: "string" },
    updated_at: { type: "string" }
  }
};

const customInfo = {
  $id: "response-custom-info",
  type: "array",
  items: {
    type: "object",
    properties: {
      group: { type: "string" },
      id: { type: "string" },
      values: { type: "array", items: { type: "string" } },
      additional_info: { type: "object" }
    }
  }
};

const pagination = {
  $id: "response-pagination",
  type: "object",
  properties: {
    current_page: { type: "integer" },
    page_size: { type: "integer" },
    total_items: { type: "integer" },
    total_pages: { type: "integer" }
  }
};

const quantity = {
  $id: "response-quantity",
  type: "object",
  properties: {
    quantity_number: { type: "integer" },
    quantity_uom: { type: "string" }
  }
};

exports.commonResponseSchemas = [
  amountSchema,
  auditSchema,
  customInfo,
  pagination,
  quantity
];
