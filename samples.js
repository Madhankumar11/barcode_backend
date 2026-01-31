export const mapping = (payload = {}) => {
  const padNumber = (num, size = 6) => String(num).padStart(size, "0");

  const languages = ["AR", "DE", "DE_CH", "EN", "FR", "FR_CH", "IT", "IT_CH"];

  const records = payload.value || [];

  const data= {
    id: `Product_${padNumber(Math.floor(Math.random() * 10000))}_${Date.now()}`,
    products: records
      .filter(
        item =>
          Array.isArray(item._ProductSalesDelivery) &&
          item._ProductSalesDelivery.length > 0
      )
      .map(item => ({
        code: item.Product,

        approvalStatus: {
          code: "approved"
        },

        catalogVersion: {
          version: "Staged",
          catalog: {
            id: "jnjSwitzerlandProductCatalog"
          }
        },

        storageCondition:
          item.WarehouseStorageCondition
            ? { code: item.WarehouseStorageCondition }
            : null,

        originCountry:
          item.CountryOfOrigin
            ? { isocode: item.CountryOfOrigin }
            : null,

        sourceSystemId: "SAP_S4",

        businessSector: item.IndustrySector,

        uomDimensions: (item._ProductUnitOfMeasure || [])
          .filter(
            uom =>
              ["BX", "EA"].includes(uom.AlternativeUnit) &&
              ["BX", "EA"].includes(uom.BaseUnit)
          )
          .map(uom => ({
            code: `${uom.Product}|${uom.GlobalTradeItemNumber}|${uom.AlternativeUnit}`,
            ean: uom.GlobalTradeItemNumber,
            denominator: String(uom.QuantityDenominator),
            numerator: String(uom.QuantityNumerator),
            altUom: {
              code: uom.AlternativeUnit
            },
            baseUnit: {
              code: uom.BaseUnit
            }
          })),

        hazmatCode: item.HandlingIndicator || "",

        materialBaseNum: item.BasicProduct || "",

        sapMaterialCode: item.Product,

        productCatalogCode: item.MsBookPartNumber || "",

        localizedAttributes: (() => {
          const descriptions = item._ProductDescription || [];
          const basicTexts = item._ProductBasicText || [];

          const descMapped = descriptions
            .filter(d => languages.includes(d.Language))
            .map(d => ({
              language: d.Language,
              name: d.ProductDescription
            }));

          const basicMapped = basicTexts
            .filter(b => languages.includes(b.Language))
            .map(b => ({
              language: b.Language,
              productBasicText: b.longtext
            }));

          if (descMapped.length && basicMapped.length) {
            return [...descMapped, ...basicMapped];
          }

          if (basicMapped.length) {
            return basicMapped;
          }

          if (descMapped.length) {
            return descMapped;
          }

          return [];
        })()
      }))
  };
  console.log(JSON.stringify(data),"data");
  return data
  
};

const payload = {
  "@odata.context" : "$metadata#ProductMain(_ProductDescription(),_ProductPlant(),_ProductSales(),_ZZ1ProductChar(),_ProductBasicText(),_ProductSalesDelivery(_ProductSalesText(),_ProductSalesTax()),_ProductValuation(),_ProductValuationAccounting(),_ProductUnitOfMeasure(_ProductUnitOfMeasureEAN()))",
  "@odata.metadataEtag" : "W/\"20260108145719\"",
  "@odata.count" : 2,
  "value" : [
    {
      "Product" : "04.037.125",
      "ProductType" : "FERT",
      "CreationDate" : "2025-06-06",
      "CreationTime" : "08:18:06",
      "CreationDateTime" : "2025-06-06T12:18:06Z",
      "CreatedByUser" : "702374355",
      "LastChangeDate" : "2026-01-08",
      "LastChangedByUser" : "702491629",
      "IsMarkedForDeletion" : false,
      "CrossPlantStatus" : "",
      "CrossPlantStatusValidityDate" : null,
      "ProductOldID" : "",
      "GrossWeight" : 250.000,
      "WeightUnit" : "KG",
      "WeightISOUnit" : "KGM",
      "ProductGroup" : "01",
      "BaseUnit" : "EA",
      "BaseISOUnit" : "EA",
      "ItemCategoryGroup" : "NORM",
      "NetWeight" : 250.000,
      "Division" : "ST",
      "VolumeUnit" : "CCM",
      "VolumeISOUnit" : "CMQ",
      "ProductVolume" : 500.000,
      "AuthorizationGroup" : "",
      "ANPCode" : "0",
      "SizeOrDimensionText" : "",
      "IndustryStandardName" : "",
      "ProductStandardID" : "07611819650558",
      "InternationalArticleNumberCat" : "IC",
      "ProductIsConfigurable" : false,
      "IsBatchManagementRequired" : true,
      "ExternalProductGroup" : "ZGR4C",
      "CrossPlantConfigurableProduct" : "",
      "SerialNoExplicitnessLevel" : "",
      "IsApprovedBatchRecordReqd" : false,
      "HandlingIndicator" : "",
      "WarehouseProductGroup" : "",
      "WarehouseStorageCondition" : "",
      "StandardHandlingUnitType" : "",
      "SerialNumberProfile" : "",
      "IsPilferable" : false,
      "IsRelevantForHzdsSubstances" : false,
      "QuarantinePeriod" : 0,
      "TimeUnitForQuarantinePeriod" : "",
      "QuarantinePeriodISOUnit" : "",
      "QualityInspectionGroup" : "",
      "HandlingUnitType" : "",
      "HasVariableTareWeight" : false,
      "MaximumPackagingLength" : 0.000,
      "MaximumPackagingWidth" : 0.000,
      "MaximumPackagingHeight" : 0.000,
      "MaximumCapacity" : 0.000,
      "OvercapacityTolerance" : 0.0,
      "UnitForMaxPackagingDimensions" : "",
      "MaxPackggDimensionISOUnit" : "",
      "BaseUnitSpecificProductLength" : 0.000,
      "BaseUnitSpecificProductWidth" : 0.000,
      "BaseUnitSpecificProductHeight" : 0.000,
      "ProductMeasurementUnit" : "",
      "ProductMeasurementISOUnit" : "",
      "ArticleCategory" : "",
      "IndustrySector" : "M",
      "LastChangeDateTime" : "2026-01-08T13:25:36Z",
      "LastChangeTime" : "08:25:36",
      "DangerousGoodsIndProfile" : "",
      "ProductDocumentChangeNumber" : "",
      "ProductDocumentPageCount" : "0",
      "ProductDocumentPageNumber" : "",
      "DocumentIsCreatedByCAD" : false,
      "ProductionOrInspectionMemoTxt" : "",
      "ProductionMemoPageFormat" : "",
      "ProductIsHighlyViscous" : false,
      "TransportIsInBulk" : false,
      "ProdEffctyParamValsAreAssigned" : false,
      "ProdIsEnvironmentallyRelevant" : false,
      "LaboratoryOrDesignOffice" : "ST",
      "PackagingProductGroup" : "",
      "PackingReferenceProduct" : "",
      "BasicProduct" : "04.037.125",
      "ProductDocumentNumber" : "",
      "ProductDocumentVersion" : "",
      "ProductDocumentType" : "",
      "ProductDocumentPageFormat" : "",
      "ProdChmlCmplncRelevanceCode" : "",
      "DiscountInKindEligibility" : "",
      "ProdCompetitorCustomerNumber" : "",
      "ProductHierarchy" : "",
      "ProdAllocDetnProcedure" : "",
      "ProductManufacturerNumber" : "",
      "ManufacturerNumber" : "",
      "ManufacturerPartProfile" : "",
      "OwnInventoryManagedProduct" : "",
      "ProductGroupDesc" : "STANDARD FINISHED GOODS",
      "DivisionDescription" : "Synthes Trauma",
      "MsBookPartNumber" : "04.037.125",
      "MaintenanceStatus" : "",
      "_ProductBasicText" : [
        {
          "Product" : "04.037.125",
          "Language" : "DE",
          "longtext" : ""
        },
        {
          "Product" : "04.037.125",
          "Language" : "EN",
          "longtext" : ""
        },
        {
          "Product" : "04.037.125",
          "Language" : "FR",
          "longtext" : ""
        }
      ],
      "_ProductDescription" : [
        {
          "@odata.etag" : "W/\"SADL-202601081325360000000C~20260108132536.0000000\"",
          "Product" : "04.037.125",
          "Language" : "EN",
          "ProductDescription" : "TFNA Fem Nail ø11 le 125° L340 TiMo15",
          "SAP__Messages" : [

          ]
        }
      ],
      "_ProductPlant" : [
        {
          "@odata.etag" : "W/\"SADL-202601081325360000000C~20260108132536.0000000\"",
          "Product" : "04.037.125",
          "Plant" : "9999",
          "ProfileCode" : "P3",
          "ProfileValidityStartDate" : "2025-01-01",
          "FiscalYearVariant" : "",
          "PeriodType" : "M",
          "ProfitCenter" : "",
          "IsMarkedForDeletion" : false,
          "ConfigurableProduct" : "",
          "StockDeterminationGroup" : "",
          "IsBatchManagementRequired" : true,
          "SerialNumberProfile" : "",
          "IsNegativeStockAllowed" : false,
          "ProductCFOPCategory" : "",
          "ProductIsExciseTaxRelevant" : false,
          "GoodsIssueUnit" : "",
          "GoodsIssueISOUnit" : "",
          "DistrCntrDistributionProfile" : "",
          "ProductIsCriticalPrt" : false,
          "ProductLogisticsHandlingGroup" : "",
          "ProductFreightGroup" : "",
          "OriginalBatchReferenceProduct" : "",
          "OriglBatchManagementIsRequired" : "",
          "BaseUnit" : "EA",
          "BaseISOUnit" : "EA",
          "ProductMinControlTemperature" : 0.00,
          "ProductMaxControlTemperature" : 0.00,
          "ProductControlTemperatureUnit" : "",
          "ProdCtrlTemperatureUnitISOCode" : "",
          "SAP__Messages" : [

          ]
        },
        {
          "@odata.etag" : "W/\"SADL-202601081325360000000C~20260108132536.0000000\"",
          "Product" : "04.037.125",
          "Plant" : "BEV5",
          "ProfileCode" : "",
          "ProfileValidityStartDate" : null,
          "FiscalYearVariant" : "",
          "PeriodType" : "M",
          "ProfitCenter" : "H20010",
          "IsMarkedForDeletion" : false,
          "ConfigurableProduct" : "",
          "StockDeterminationGroup" : "",
          "IsBatchManagementRequired" : true,
          "SerialNumberProfile" : "",
          "IsNegativeStockAllowed" : false,
          "ProductCFOPCategory" : "",
          "ProductIsExciseTaxRelevant" : false,
          "GoodsIssueUnit" : "",
          "GoodsIssueISOUnit" : "",
          "DistrCntrDistributionProfile" : "",
          "ProductIsCriticalPrt" : false,
          "ProductLogisticsHandlingGroup" : "",
          "ProductFreightGroup" : "",
          "OriginalBatchReferenceProduct" : "",
          "OriglBatchManagementIsRequired" : "",
          "BaseUnit" : "EA",
          "BaseISOUnit" : "EA",
          "ProductMinControlTemperature" : 0.00,
          "ProductMaxControlTemperature" : 0.00,
          "ProductControlTemperatureUnit" : "",
          "ProdCtrlTemperatureUnitISOCode" : "",
          "SAP__Messages" : [

          ]
        },
        {
          "@odata.etag" : "W/\"SADL-202601081325360000000C~20260108132536.0000000\"",
          "Product" : "04.037.125",
          "Plant" : "NLV1",
          "ProfileCode" : "P3",
          "ProfileValidityStartDate" : "2025-01-01",
          "FiscalYearVariant" : "",
          "PeriodType" : "M",
          "ProfitCenter" : "H20011",
          "IsMarkedForDeletion" : false,
          "ConfigurableProduct" : "",
          "StockDeterminationGroup" : "",
          "IsBatchManagementRequired" : true,
          "SerialNumberProfile" : "",
          "IsNegativeStockAllowed" : false,
          "ProductCFOPCategory" : "",
          "ProductIsExciseTaxRelevant" : false,
          "GoodsIssueUnit" : "",
          "GoodsIssueISOUnit" : "",
          "DistrCntrDistributionProfile" : "",
          "ProductIsCriticalPrt" : false,
          "ProductLogisticsHandlingGroup" : "",
          "ProductFreightGroup" : "",
          "OriginalBatchReferenceProduct" : "",
          "OriglBatchManagementIsRequired" : "",
          "BaseUnit" : "EA",
          "BaseISOUnit" : "EA",
          "ProductMinControlTemperature" : 0.00,
          "ProductMaxControlTemperature" : 0.00,
          "ProductControlTemperatureUnit" : "",
          "ProdCtrlTemperatureUnitISOCode" : "",
          "SAP__Messages" : [

          ]
        },
        {
          "@odata.etag" : "W/\"SADL-202601081325360000000C~20260108132536.0000000\"",
          "Product" : "04.037.125",
          "Plant" : "BEV8",
          "ProfileCode" : "P3",
          "ProfileValidityStartDate" : "2025-01-01",
          "FiscalYearVariant" : "",
          "PeriodType" : "M",
          "ProfitCenter" : "H20011",
          "IsMarkedForDeletion" : false,
          "ConfigurableProduct" : "",
          "StockDeterminationGroup" : "",
          "IsBatchManagementRequired" : true,
          "SerialNumberProfile" : "",
          "IsNegativeStockAllowed" : false,
          "ProductCFOPCategory" : "",
          "ProductIsExciseTaxRelevant" : false,
          "GoodsIssueUnit" : "",
          "GoodsIssueISOUnit" : "",
          "DistrCntrDistributionProfile" : "",
          "ProductIsCriticalPrt" : false,
          "ProductLogisticsHandlingGroup" : "",
          "ProductFreightGroup" : "",
          "OriginalBatchReferenceProduct" : "",
          "OriglBatchManagementIsRequired" : "",
          "BaseUnit" : "EA",
          "BaseISOUnit" : "EA",
          "ProductMinControlTemperature" : 0.00,
          "ProductMaxControlTemperature" : 0.00,
          "ProductControlTemperatureUnit" : "",
          "ProdCtrlTemperatureUnitISOCode" : "",
          "SAP__Messages" : [

          ]
        },
        {
          "@odata.etag" : "W/\"SADL-202601081325360000000C~20260108132536.0000000\"",
          "Product" : "04.037.125",
          "Plant" : "LUN6",
          "ProfileCode" : "P3",
          "ProfileValidityStartDate" : "2025-01-01",
          "FiscalYearVariant" : "",
          "PeriodType" : "M",
          "ProfitCenter" : "H20011",
          "IsMarkedForDeletion" : false,
          "ConfigurableProduct" : "",
          "StockDeterminationGroup" : "",
          "IsBatchManagementRequired" : true,
          "SerialNumberProfile" : "",
          "IsNegativeStockAllowed" : false,
          "ProductCFOPCategory" : "",
          "ProductIsExciseTaxRelevant" : false,
          "GoodsIssueUnit" : "",
          "GoodsIssueISOUnit" : "",
          "DistrCntrDistributionProfile" : "",
          "ProductIsCriticalPrt" : false,
          "ProductLogisticsHandlingGroup" : "",
          "ProductFreightGroup" : "",
          "OriginalBatchReferenceProduct" : "",
          "OriglBatchManagementIsRequired" : "",
          "BaseUnit" : "EA",
          "BaseISOUnit" : "EA",
          "ProductMinControlTemperature" : 0.00,
          "ProductMaxControlTemperature" : 0.00,
          "ProductControlTemperatureUnit" : "",
          "ProdCtrlTemperatureUnitISOCode" : "",
          "SAP__Messages" : [

          ]
        },
        {
          "@odata.etag" : "W/\"SADL-202601081325360000000C~20260108132536.0000000\"",
          "Product" : "04.037.125",
          "Plant" : "BEV7",
          "ProfileCode" : "P3",
          "ProfileValidityStartDate" : "2025-01-01",
          "FiscalYearVariant" : "",
          "PeriodType" : "M",
          "ProfitCenter" : "H20011",
          "IsMarkedForDeletion" : false,
          "ConfigurableProduct" : "",
          "StockDeterminationGroup" : "",
          "IsBatchManagementRequired" : true,
          "SerialNumberProfile" : "",
          "IsNegativeStockAllowed" : false,
          "ProductCFOPCategory" : "",
          "ProductIsExciseTaxRelevant" : false,
          "GoodsIssueUnit" : "",
          "GoodsIssueISOUnit" : "",
          "DistrCntrDistributionProfile" : "",
          "ProductIsCriticalPrt" : false,
          "ProductLogisticsHandlingGroup" : "",
          "ProductFreightGroup" : "",
          "OriginalBatchReferenceProduct" : "",
          "OriglBatchManagementIsRequired" : "",
          "BaseUnit" : "EA",
          "BaseISOUnit" : "EA",
          "ProductMinControlTemperature" : 0.00,
          "ProductMaxControlTemperature" : 0.00,
          "ProductControlTemperatureUnit" : "",
          "ProdCtrlTemperatureUnitISOCode" : "",
          "SAP__Messages" : [

          ]
        }
      ],
      "_ProductSales" : {
        "@odata.etag" : "W/\"SADL-202601081325360000000C~20260108132536.0000000\"",
        "Product" : "04.037.125",
        "SalesStatus" : "",
        "SalesStatusValidityDate" : null,
        "TransportationGroup" : "Z001",
        "PackagingProductType" : "",
        "AllowedPackagingWeightQty" : 0.000,
        "AllowedPackagingWeightQtyUnit" : "",
        "AllwdPackagingWeightQtyISOUnit" : "",
        "AllowedPackagingVolumeQty" : 0.000,
        "AllowedPackagingVolumeQtyUnit" : "",
        "AllwdPackagingVolumeQtyISOUnit" : "",
        "MaximumLevelByVolumeInPercent" : 0,
        "ExcessWeightToleranceValue" : 0.0,
        "PackggProductIsClosedPackaging" : false,
        "ProductStackingFactor" : 0,
        "ProdExcessVolumeToleranceValue" : 0.0,
        "SAP__Messages" : [

        ]
      },
      "_ProductSalesDelivery" : [
        {
          "Product" : "04.037.125",
          "ProductSalesOrg" : "BE60",
          "ProductDistributionChnl" : "10",
          "MinimumOrderQuantity" : 0,
          "SupplyingPlant" : "LUN6",
          "PriceSpecificationProductGroup" : "",
          "AccountDetnProductGroup" : "01",
          "DeliveryNoteProcMinDelivQty" : 0,
          "ItemCategoryGroup" : "NORM",
          "DeliveryQuantityUnit" : "",
          "DeliveryQuantityISOUnit" : "",
          "DeliveryQuantity" : 0.000,
          "ProductSalesStatus" : "D2",
          "ProductSalesStatusValidityDate" : "2025-01-01",
          "SalesMeasureUnit" : "BX",
          "SalesMeasureISOUnit" : "BX",
          "IsMarkedForDeletion" : false,
          "FirstSalesSpecProductGroup" : "",
          "SecondSalesSpecProductGroup" : "",
          "ThirdSalesSpecProductGroup" : "",
          "FourthSalesSpecProductGroup" : "",
          "FifthSalesSpecProductGroup" : "",
          "LogisticsStatisticsGroup" : "1",
          "VolumeRebateGroup" : "",
          "CashDiscountIsDeductible" : true,
          "RoundingProfile" : "",
          "VariableSalesUnitIsNotAllowed" : false,
          "ProductCommissionGroup" : "",
          "PricingReferenceProduct" : "",
          "ProductHasAttributeID01" : false,
          "ProductHasAttributeID02" : false,
          "ProductHasAttributeID03" : false,
          "ProductHasAttributeID04" : false,
          "ProductHasAttributeID05" : false,
          "ProductHasAttributeID06" : false,
          "ProductHasAttributeID07" : false,
          "ProductHasAttributeID08" : false,
          "ProductHasAttributeID09" : false,
          "ProductHasAttributeID10" : false,
          "ProdIsEntlmntRlvt" : false,
          "BaseUnit" : "EA",
          "ProductHierarchy" : "BEBF0BFHBFH1AFH1AA",
          "BaseISOUnit" : "EA",
          "ProductHierarchy1Desc" : "Belgium",
          "ProductHierarchy2Desc" : "EndoMech",
          "ProductHierarchy3Desc" : "Trocars",
          "ProductHierarchy4Desc" : "Trocars",
          "ProductHierarchy5Desc" : "Trocars",
          "ProductSalesStatusDescription" : "Active Saleable",
          "FirstSalesSpecProductGroupDesc" : "",
          "SecondSalesSpecProductGroupDes" : "",
          "_ProductSalesTax" : [
            {
              "Product" : "04.037.125",
              "Country" : "BE",
              "TaxCategory" : "ZVTX",
              "TaxClassification" : "1",
              "SAP__Messages" : [

              ]
            },
            {
              "Product" : "04.037.125",
              "Country" : "BE",
              "TaxCategory" : "ZCM1",
              "TaxClassification" : "0",
              "SAP__Messages" : [

              ]
            },
            {
              "Product" : "04.037.125",
              "Country" : "CH",
              "TaxCategory" : "ZVTX",
              "TaxClassification" : "1",
              "SAP__Messages" : [

              ]
            },
            {
              "Product" : "04.037.125",
              "Country" : "DE",
              "TaxCategory" : "MWST",
              "TaxClassification" : "0",
              "SAP__Messages" : [

              ]
            },
            {
              "Product" : "04.037.125",
              "Country" : "LU",
              "TaxCategory" : "ZVTX",
              "TaxClassification" : "1",
              "SAP__Messages" : [

              ]
            },
            {
              "Product" : "04.037.125",
              "Country" : "LU",
              "TaxCategory" : "ZCM1",
              "TaxClassification" : "0",
              "SAP__Messages" : [

              ]
            },
            {
              "Product" : "04.037.125",
              "Country" : "NL",
              "TaxCategory" : "ZVTX",
              "TaxClassification" : "1",
              "SAP__Messages" : [

              ]
            },
            {
              "Product" : "04.037.125",
              "Country" : "NL",
              "TaxCategory" : "ZCM1",
              "TaxClassification" : "1",
              "SAP__Messages" : [

              ]
            }
          ],
          "_ProductSalesText" : [

          ]
        },
        {
          "Product" : "04.037.125",
          "ProductSalesOrg" : "BE60",
          "ProductDistributionChnl" : "30",
          "MinimumOrderQuantity" : 0,
          "SupplyingPlant" : "",
          "PriceSpecificationProductGroup" : "",
          "AccountDetnProductGroup" : "",
          "DeliveryNoteProcMinDelivQty" : 0,
          "ItemCategoryGroup" : "NORM",
          "DeliveryQuantityUnit" : "",
          "DeliveryQuantityISOUnit" : "",
          "DeliveryQuantity" : 0.000,
          "ProductSalesStatus" : "",
          "ProductSalesStatusValidityDate" : null,
          "SalesMeasureUnit" : "",
          "SalesMeasureISOUnit" : "",
          "IsMarkedForDeletion" : false,
          "FirstSalesSpecProductGroup" : "",
          "SecondSalesSpecProductGroup" : "",
          "ThirdSalesSpecProductGroup" : "",
          "FourthSalesSpecProductGroup" : "",
          "FifthSalesSpecProductGroup" : "",
          "LogisticsStatisticsGroup" : "",
          "VolumeRebateGroup" : "",
          "CashDiscountIsDeductible" : true,
          "RoundingProfile" : "",
          "VariableSalesUnitIsNotAllowed" : false,
          "ProductCommissionGroup" : "",
          "PricingReferenceProduct" : "",
          "ProductHasAttributeID01" : false,
          "ProductHasAttributeID02" : false,
          "ProductHasAttributeID03" : false,
          "ProductHasAttributeID04" : false,
          "ProductHasAttributeID05" : false,
          "ProductHasAttributeID06" : false,
          "ProductHasAttributeID07" : false,
          "ProductHasAttributeID08" : false,
          "ProductHasAttributeID09" : false,
          "ProductHasAttributeID10" : false,
          "ProdIsEntlmntRlvt" : false,
          "BaseUnit" : "EA",
          "ProductHierarchy" : "",
          "BaseISOUnit" : "EA",
          "ProductHierarchy1Desc" : "",
          "ProductHierarchy2Desc" : "",
          "ProductHierarchy3Desc" : "",
          "ProductHierarchy4Desc" : "",
          "ProductHierarchy5Desc" : "",
          "ProductSalesStatusDescription" : "",
          "FirstSalesSpecProductGroupDesc" : "",
          "SecondSalesSpecProductGroupDes" : "",
          "_ProductSalesTax" : [
            {
              "Product" : "04.037.125",
              "Country" : "BE",
              "TaxCategory" : "ZVTX",
              "TaxClassification" : "1",
              "SAP__Messages" : [

              ]
            },
            {
              "Product" : "04.037.125",
              "Country" : "BE",
              "TaxCategory" : "ZCM1",
              "TaxClassification" : "0",
              "SAP__Messages" : [

              ]
            },
            {
              "Product" : "04.037.125",
              "Country" : "CH",
              "TaxCategory" : "ZVTX",
              "TaxClassification" : "1",
              "SAP__Messages" : [

              ]
            },
            {
              "Product" : "04.037.125",
              "Country" : "DE",
              "TaxCategory" : "MWST",
              "TaxClassification" : "0",
              "SAP__Messages" : [

              ]
            },
            {
              "Product" : "04.037.125",
              "Country" : "LU",
              "TaxCategory" : "ZVTX",
              "TaxClassification" : "1",
              "SAP__Messages" : [

              ]
            },
            {
              "Product" : "04.037.125",
              "Country" : "LU",
              "TaxCategory" : "ZCM1",
              "TaxClassification" : "0",
              "SAP__Messages" : [

              ]
            },
            {
              "Product" : "04.037.125",
              "Country" : "NL",
              "TaxCategory" : "ZVTX",
              "TaxClassification" : "1",
              "SAP__Messages" : [

              ]
            },
            {
              "Product" : "04.037.125",
              "Country" : "NL",
              "TaxCategory" : "ZCM1",
              "TaxClassification" : "1",
              "SAP__Messages" : [

              ]
            }
          ],
          "_ProductSalesText" : [

          ]
        }
      ],
      "_ProductUnitOfMeasure" : [
        {
          "@odata.etag" : "W/\"SADL-202601081325360000000C~20260108132536.0000000\"",
          "Product" : "04.037.125",
          "AlternativeUnit" : "BX",
          "AlternativeSAPUnit" : "BX",
          "AlternativeISOUnit" : "BX",
          "QuantityNumerator" : 2,
          "QuantityDenominator" : 1,
          "ProductVolume" : 500.000,
          "VolumeUnit" : "CCM",
          "VolumeISOUnit" : "CMQ",
          "GrossWeight" : 250.000,
          "WeightUnit" : "KG",
          "WeightISOUnit" : "KGM",
          "GlobalTradeItemNumber" : "07611819650558",
          "GlobalTradeItemNumberCategory" : "IC",
          "UnitSpecificProductLength" : 0.000,
          "UnitSpecificProductWidth" : 0.000,
          "UnitSpecificProductHeight" : 0.000,
          "ProductMeasurementUnit" : "",
          "ProductMeasurementISOUnit" : "",
          "LowerLevelPackagingUnit" : "",
          "LowerLevelPackagingISOUnit" : "",
          "MaximumStackingFactor" : 0,
          "CapacityUsage" : 0.000,
          "BaseUnit" : "EA",
          "BaseISOUnit" : "EA",
          "SAP__Messages" : [

          ],
          "_ProductUnitOfMeasureEAN" : [
            {
              "@odata.etag" : "W/\"SADL-202601081325360000000C~20260108132536.0000000\"",
              "Product" : "04.037.125",
              "AlternativeUnit" : "BX",
              "ConsecutiveNumber" : "00001",
              "AlternativeISOUnit" : "BX",
              "ProductStandardID" : "07611819650558",
              "InternationalArticleNumberCat" : "IC",
              "IsMainGlobalTradeItemNumber" : true,
              "SAP__Messages" : [

              ]
            }
          ]
        },
        {
          "@odata.etag" : "W/\"SADL-202601081325360000000C~20260108132536.0000000\"",
          "Product" : "04.037.125",
          "AlternativeUnit" : "EA",
          "AlternativeSAPUnit" : "EA",
          "AlternativeISOUnit" : "EA",
          "QuantityNumerator" : 1,
          "QuantityDenominator" : 1,
          "ProductVolume" : 500.000,
          "VolumeUnit" : "CCM",
          "VolumeISOUnit" : "CMQ",
          "GrossWeight" : 250.000,
          "WeightUnit" : "KG",
          "WeightISOUnit" : "KGM",
          "GlobalTradeItemNumber" : "07611819650558",
          "GlobalTradeItemNumberCategory" : "IC",
          "UnitSpecificProductLength" : 0.000,
          "UnitSpecificProductWidth" : 0.000,
          "UnitSpecificProductHeight" : 0.000,
          "ProductMeasurementUnit" : "",
          "ProductMeasurementISOUnit" : "",
          "LowerLevelPackagingUnit" : "",
          "LowerLevelPackagingISOUnit" : "",
          "MaximumStackingFactor" : 0,
          "CapacityUsage" : 0.000,
          "BaseUnit" : "EA",
          "BaseISOUnit" : "EA",
          "SAP__Messages" : [

          ],
          "_ProductUnitOfMeasureEAN" : [
            {
              "@odata.etag" : "W/\"SADL-202601081325360000000C~20260108132536.0000000\"",
              "Product" : "04.037.125",
              "AlternativeUnit" : "EA",
              "ConsecutiveNumber" : "00001",
              "AlternativeISOUnit" : "EA",
              "ProductStandardID" : "07611819650558",
              "InternationalArticleNumberCat" : "IC",
              "IsMainGlobalTradeItemNumber" : true,
              "SAP__Messages" : [

              ]
            }
          ]
        }
      ],
      "_ProductValuation" : [
        {
          "@odata.etag" : "W/\"SADL-202601081325360000000C~20260108132536.0000000\"",
          "Product" : "04.037.125",
          "ValuationArea" : "BEV7",
          "ValuationType" : "",
          "ValuationClass" : "7920",
          "PriceDeterminationControl" : "3",
          "StandardPrice" : 5000.00,
          "ProductPriceUnitQuantity" : 1,
          "InventoryValuationProcedure" : "S",
          "MovingAveragePrice" : 0.00,
          "ValuationCategory" : "",
          "ProductUsageType" : "",
          "ProductOriginType" : "",
          "IsProducedInhouse" : false,
          "IsMarkedForDeletion" : false,
          "ValuationClassSalesOrderStock" : "",
          "ProjectStockValuationClass" : "",
          "Currency" : "EUR",
          "BaseUnit" : "EA",
          "BaseISOUnit" : "EA",
          "SAP__Messages" : [

          ]
        },
        {
          "@odata.etag" : "W/\"SADL-202601081325360000000C~20260108132536.0000000\"",
          "Product" : "04.037.125",
          "ValuationArea" : "BEV8",
          "ValuationType" : "",
          "ValuationClass" : "7920",
          "PriceDeterminationControl" : "3",
          "StandardPrice" : 5000.00,
          "ProductPriceUnitQuantity" : 1,
          "InventoryValuationProcedure" : "S",
          "MovingAveragePrice" : 0.00,
          "ValuationCategory" : "",
          "ProductUsageType" : "",
          "ProductOriginType" : "",
          "IsProducedInhouse" : false,
          "IsMarkedForDeletion" : false,
          "ValuationClassSalesOrderStock" : "",
          "ProjectStockValuationClass" : "",
          "Currency" : "EUR",
          "BaseUnit" : "EA",
          "BaseISOUnit" : "EA",
          "SAP__Messages" : [

          ]
        },
        {
          "@odata.etag" : "W/\"SADL-202601081325360000000C~20260108132536.0000000\"",
          "Product" : "04.037.125",
          "ValuationArea" : "NLV1",
          "ValuationType" : "",
          "ValuationClass" : "7920",
          "PriceDeterminationControl" : "3",
          "StandardPrice" : 5000.00,
          "ProductPriceUnitQuantity" : 1,
          "InventoryValuationProcedure" : "S",
          "MovingAveragePrice" : 0.00,
          "ValuationCategory" : "",
          "ProductUsageType" : "",
          "ProductOriginType" : "",
          "IsProducedInhouse" : false,
          "IsMarkedForDeletion" : false,
          "ValuationClassSalesOrderStock" : "",
          "ProjectStockValuationClass" : "",
          "Currency" : "EUR",
          "BaseUnit" : "EA",
          "BaseISOUnit" : "EA",
          "SAP__Messages" : [

          ]
        },
        {
          "@odata.etag" : "W/\"SADL-202601081325360000000C~20260108132536.0000000\"",
          "Product" : "04.037.125",
          "ValuationArea" : "BEV5",
          "ValuationType" : "",
          "ValuationClass" : "7920",
          "PriceDeterminationControl" : "3",
          "StandardPrice" : 5000.00,
          "ProductPriceUnitQuantity" : 1,
          "InventoryValuationProcedure" : "S",
          "MovingAveragePrice" : 0.00,
          "ValuationCategory" : "",
          "ProductUsageType" : "",
          "ProductOriginType" : "",
          "IsProducedInhouse" : false,
          "IsMarkedForDeletion" : false,
          "ValuationClassSalesOrderStock" : "",
          "ProjectStockValuationClass" : "",
          "Currency" : "EUR",
          "BaseUnit" : "EA",
          "BaseISOUnit" : "EA",
          "SAP__Messages" : [

          ]
        }
      ],
      "_ProductValuationAccounting" : [
        {
          "@odata.etag" : "W/\"SADL-202601081325360000000C~20260108132536.0000000\"",
          "Product" : "04.037.125",
          "ValuationArea" : "BEV7",
          "ValuationType" : "",
          "CommercialPrice1InCoCodeCrcy" : 0.00,
          "CommercialPrice2InCoCodeCrcy" : 0.00,
          "CommercialPrice3InCoCodeCrcy" : 0.00,
          "DevaluationYearCount" : "0",
          "FuturePrice" : 0.00,
          "FuturePriceValidityStartDate" : null,
          "LIFOValuationPoolNumber" : "",
          "TaxPricel1InCoCodeCrcy" : 0.00,
          "TaxPrice2InCoCodeCrcy" : 0.00,
          "TaxPrice3InCoCodeCrcy" : 0.00,
          "TaxBasedPricesPriceUnitQty" : 0,
          "IsLIFOAndFIFORelevant" : false,
          "Currency" : "EUR",
          "BaseUnit" : "EA",
          "BaseISOUnit" : "EA",
          "SAP__Messages" : [

          ]
        },
        {
          "@odata.etag" : "W/\"SADL-202601081325360000000C~20260108132536.0000000\"",
          "Product" : "04.037.125",
          "ValuationArea" : "BEV8",
          "ValuationType" : "",
          "CommercialPrice1InCoCodeCrcy" : 0.00,
          "CommercialPrice2InCoCodeCrcy" : 0.00,
          "CommercialPrice3InCoCodeCrcy" : 0.00,
          "DevaluationYearCount" : "0",
          "FuturePrice" : 0.00,
          "FuturePriceValidityStartDate" : null,
          "LIFOValuationPoolNumber" : "",
          "TaxPricel1InCoCodeCrcy" : 0.00,
          "TaxPrice2InCoCodeCrcy" : 0.00,
          "TaxPrice3InCoCodeCrcy" : 0.00,
          "TaxBasedPricesPriceUnitQty" : 0,
          "IsLIFOAndFIFORelevant" : false,
          "Currency" : "EUR",
          "BaseUnit" : "EA",
          "BaseISOUnit" : "EA",
          "SAP__Messages" : [

          ]
        },
        {
          "@odata.etag" : "W/\"SADL-202601081325360000000C~20260108132536.0000000\"",
          "Product" : "04.037.125",
          "ValuationArea" : "NLV1",
          "ValuationType" : "",
          "CommercialPrice1InCoCodeCrcy" : 0.00,
          "CommercialPrice2InCoCodeCrcy" : 0.00,
          "CommercialPrice3InCoCodeCrcy" : 0.00,
          "DevaluationYearCount" : "0",
          "FuturePrice" : 0.00,
          "FuturePriceValidityStartDate" : null,
          "LIFOValuationPoolNumber" : "",
          "TaxPricel1InCoCodeCrcy" : 0.00,
          "TaxPrice2InCoCodeCrcy" : 0.00,
          "TaxPrice3InCoCodeCrcy" : 0.00,
          "TaxBasedPricesPriceUnitQty" : 0,
          "IsLIFOAndFIFORelevant" : false,
          "Currency" : "EUR",
          "BaseUnit" : "EA",
          "BaseISOUnit" : "EA",
          "SAP__Messages" : [

          ]
        },
        {
          "@odata.etag" : "W/\"SADL-202601081325360000000C~20260108132536.0000000\"",
          "Product" : "04.037.125",
          "ValuationArea" : "BEV5",
          "ValuationType" : "",
          "CommercialPrice1InCoCodeCrcy" : 0.00,
          "CommercialPrice2InCoCodeCrcy" : 0.00,
          "CommercialPrice3InCoCodeCrcy" : 0.00,
          "DevaluationYearCount" : "0",
          "FuturePrice" : 0.00,
          "FuturePriceValidityStartDate" : null,
          "LIFOValuationPoolNumber" : "",
          "TaxPricel1InCoCodeCrcy" : 0.00,
          "TaxPrice2InCoCodeCrcy" : 0.00,
          "TaxPrice3InCoCodeCrcy" : 0.00,
          "TaxBasedPricesPriceUnitQty" : 0,
          "IsLIFOAndFIFORelevant" : false,
          "Currency" : "EUR",
          "BaseUnit" : "EA",
          "BaseISOUnit" : "EA",
          "SAP__Messages" : [

          ]
        }
      ],
      "_ZZ1ProductChar" : [
        {
          "Product" : "04.037.125",
          "ClassType" : "001",
          "CharcInternalID" : "807",
          "CharcValuePositionNumber" : "1",
          "CharcDataType" : "CHAR",
          "CharcValue" : "I",
          "CharcNumericValue" : 0.00000000000000,
          "Characteristic" : "FINANCE_CLASSIFICATION",
          "CharcValueDescription" : "Inventory"
        },
        {
          "Product" : "04.037.125",
          "ClassType" : "001",
          "CharcInternalID" : "811",
          "CharcValuePositionNumber" : "1",
          "CharcDataType" : "CHAR",
          "CharcValue" : "HUMAN",
          "CharcNumericValue" : 0.00000000000000,
          "Characteristic" : "SELLING_PROCESS",
          "CharcValueDescription" : "Human"
        },
        {
          "Product" : "04.037.125",
          "ClassType" : "001",
          "CharcInternalID" : "813",
          "CharcValuePositionNumber" : "2",
          "CharcDataType" : "CHAR",
          "CharcValue" : "N",
          "CharcNumericValue" : 0.00000000000000,
          "Characteristic" : "STERILE",
          "CharcValueDescription" : "No"
        },
        {
          "Product" : "04.037.125",
          "ClassType" : "001",
          "CharcInternalID" : "815",
          "CharcValuePositionNumber" : "1",
          "CharcDataType" : "CHAR",
          "CharcValue" : "IMPLANT",
          "CharcNumericValue" : 0.00000000000000,
          "Characteristic" : "TYPE_OF_MATERIAL",
          "CharcValueDescription" : "Implant"
        }
      ]
    },
    {
      "Product" : "04.037.125S",
      "ProductType" : "FERT",
      "CreationDate" : "2025-05-30",
      "CreationTime" : "09:16:01",
      "CreationDateTime" : "2025-05-30T13:16:01Z",
      "CreatedByUser" : "702374357",
      "LastChangeDate" : "2026-01-08",
      "LastChangedByUser" : "702508060",
      "IsMarkedForDeletion" : false,
      "CrossPlantStatus" : "",
      "CrossPlantStatusValidityDate" : null,
      "ProductOldID" : "",
      "GrossWeight" : 2.000,
      "WeightUnit" : "KG",
      "WeightISOUnit" : "KGM",
      "ProductGroup" : "01",
      "BaseUnit" : "EA",
      "BaseISOUnit" : "EA",
      "ItemCategoryGroup" : "NORM",
      "NetWeight" : 2.000,
      "Division" : "ST",
      "VolumeUnit" : "CCM",
      "VolumeISOUnit" : "CMQ",
      "ProductVolume" : 500.000,
      "AuthorizationGroup" : "",
      "ANPCode" : "0",
      "SizeOrDimensionText" : "",
      "IndustryStandardName" : "",
      "ProductStandardID" : "07611819650350",
      "InternationalArticleNumberCat" : "IC",
      "ProductIsConfigurable" : false,
      "IsBatchManagementRequired" : true,
      "ExternalProductGroup" : "",
      "CrossPlantConfigurableProduct" : "",
      "SerialNoExplicitnessLevel" : "",
      "IsApprovedBatchRecordReqd" : false,
      "HandlingIndicator" : "",
      "WarehouseProductGroup" : "",
      "WarehouseStorageCondition" : "",
      "StandardHandlingUnitType" : "",
      "SerialNumberProfile" : "",
      "IsPilferable" : false,
      "IsRelevantForHzdsSubstances" : false,
      "QuarantinePeriod" : 0,
      "TimeUnitForQuarantinePeriod" : "",
      "QuarantinePeriodISOUnit" : "",
      "QualityInspectionGroup" : "",
      "HandlingUnitType" : "",
      "HasVariableTareWeight" : false,
      "MaximumPackagingLength" : 0.000,
      "MaximumPackagingWidth" : 0.000,
      "MaximumPackagingHeight" : 0.000,
      "MaximumCapacity" : 0.000,
      "OvercapacityTolerance" : 0.0,
      "UnitForMaxPackagingDimensions" : "",
      "MaxPackggDimensionISOUnit" : "",
      "BaseUnitSpecificProductLength" : 5.000,
      "BaseUnitSpecificProductWidth" : 10.000,
      "BaseUnitSpecificProductHeight" : 15.000,
      "ProductMeasurementUnit" : "CM",
      "ProductMeasurementISOUnit" : "CMT",
      "ArticleCategory" : "",
      "IndustrySector" : "M",
      "LastChangeDateTime" : "2026-01-08T14:48:27Z",
      "LastChangeTime" : "09:48:27",
      "DangerousGoodsIndProfile" : "",
      "ProductDocumentChangeNumber" : "",
      "ProductDocumentPageCount" : "0",
      "ProductDocumentPageNumber" : "",
      "DocumentIsCreatedByCAD" : false,
      "ProductionOrInspectionMemoTxt" : "",
      "ProductionMemoPageFormat" : "",
      "ProductIsHighlyViscous" : false,
      "TransportIsInBulk" : false,
      "ProdEffctyParamValsAreAssigned" : false,
      "ProdIsEnvironmentallyRelevant" : false,
      "LaboratoryOrDesignOffice" : "ST",
      "PackagingProductGroup" : "0001",
      "PackingReferenceProduct" : "",
      "BasicProduct" : "04.037.125S",
      "ProductDocumentNumber" : "",
      "ProductDocumentVersion" : "",
      "ProductDocumentType" : "",
      "ProductDocumentPageFormat" : "",
      "ProdChmlCmplncRelevanceCode" : "",
      "DiscountInKindEligibility" : "",
      "ProdCompetitorCustomerNumber" : "",
      "ProductHierarchy" : "00001",
      "ProdAllocDetnProcedure" : "",
      "ProductManufacturerNumber" : "",
      "ManufacturerNumber" : "",
      "ManufacturerPartProfile" : "",
      "OwnInventoryManagedProduct" : "",
      "ProductGroupDesc" : "STANDARD FINISHED GOODS",
      "DivisionDescription" : "Synthes Trauma",
      "MsBookPartNumber" : "04.037.125S",
      "MaintenanceStatus" : "",
      "_ProductBasicText" : [
        {
          "Product" : "04.037.125S",
          "Language" : "DE",
          "longtext" : " DE - TFNA Fem Nail ø11 le 125° L340 TiMo15 Basic data text in English for test. TFNA Fem Nail ø11 le 125° L340 TiMo15 Basic data text in English for test. TFNA Fem Nail ø11 le 125° L340 TiMo15 Basic data text in English for test. TFNA Fem Nail ø11 le 125° L340 TiMo15 Basic data text in English for test. TFNA Fem Nail ø11 le 125° L340 TiMo15 Basic data text in English for test. TFNA Fem Nail ø11 le 125° L340 TiMo15 Basic data text in English for test. TFNA Fem Nail ø11 le 125° L340 TiMo15 Basic data text in English for test"
        },
        {
          "Product" : "04.037.125S",
          "Language" : "EN",
          "longtext" : " EN - TFNA Fem Nail ø11 le 125° L340 TiMo15 Basic data text in English for test. TFNA Fem Nail ø11 le 125° L340 TiMo15 Basic data text in English for test. TFNA Fem Nail ø11 le 125° L340 TiMo15 Basic data text in English for test. TFNA Fem Nail ø11 le 125° L340 TiMo15 Basic data text in English for test. TFNA Fem Nail ø11 le 125° L340 TiMo15 Basic data text in English for test. TFNA Fem Nail ø11 le 125° L340 TiMo15 Basic data text in English for test. TFNA Fem Nail ø11 le 125° L340 TiMo15 Basic data text in English for test"
        },
        {
          "Product" : "04.037.125S",
          "Language" : "FR",
          "longtext" : " FR - TFNA Fem Nail ø11 le 125° L340 TiMo15 Basic data text in English for test. TFNA Fem Nail ø11 le 125° L340 TiMo15 Basic data text in English for test. TFNA Fem Nail ø11 le 125° L340 TiMo15 Basic data text in English for test. TFNA Fem Nail ø11 le 125° L340 TiMo15 Basic data text in English for test. TFNA Fem Nail ø11 le 125° L340 TiMo15 Basic data text in English for test. TFNA Fem Nail ø11 le 125° L340 TiMo15 Basic data text in English for test. TFNA Fem Nail ø11 le 125° L340 TiMo15 Basic data text in English for test"
        }
      ],
      "_ProductDescription" : [
        {
          "@odata.etag" : "W/\"SADL-202601081448270000000C~20260108144827.0000000\"",
          "Product" : "04.037.125S",
          "Language" : "EN",
          "ProductDescription" : "TFNA Fem Nail ø11 le 125° L340 TiMo15",
          "SAP__Messages" : [

          ]
        }
      ],
      "_ProductPlant" : [
        {
          "@odata.etag" : "W/\"SADL-202601081448270000000C~20260108144827.0000000\"",
          "Product" : "04.037.125S",
          "Plant" : "BEN8",
          "ProfileCode" : "P3",
          "ProfileValidityStartDate" : "2025-01-01",
          "FiscalYearVariant" : "",
          "PeriodType" : "M",
          "ProfitCenter" : "H20011",
          "IsMarkedForDeletion" : false,
          "ConfigurableProduct" : "",
          "StockDeterminationGroup" : "",
          "IsBatchManagementRequired" : true,
          "SerialNumberProfile" : "",
          "IsNegativeStockAllowed" : false,
          "ProductCFOPCategory" : "",
          "ProductIsExciseTaxRelevant" : false,
          "GoodsIssueUnit" : "",
          "GoodsIssueISOUnit" : "",
          "DistrCntrDistributionProfile" : "",
          "ProductIsCriticalPrt" : false,
          "ProductLogisticsHandlingGroup" : "",
          "ProductFreightGroup" : "",
          "OriginalBatchReferenceProduct" : "",
          "OriglBatchManagementIsRequired" : "",
          "BaseUnit" : "EA",
          "BaseISOUnit" : "EA",
          "ProductMinControlTemperature" : 0.00,
          "ProductMaxControlTemperature" : 0.00,
          "ProductControlTemperatureUnit" : "",
          "ProdCtrlTemperatureUnitISOCode" : "",
          "SAP__Messages" : [

          ]
        },
        {
          "@odata.etag" : "W/\"SADL-202601081448270000000C~20260108144827.0000000\"",
          "Product" : "04.037.125S",
          "Plant" : "NLN1",
          "ProfileCode" : "P3",
          "ProfileValidityStartDate" : "2025-01-01",
          "FiscalYearVariant" : "",
          "PeriodType" : "M",
          "ProfitCenter" : "H20011",
          "IsMarkedForDeletion" : false,
          "ConfigurableProduct" : "",
          "StockDeterminationGroup" : "",
          "IsBatchManagementRequired" : true,
          "SerialNumberProfile" : "",
          "IsNegativeStockAllowed" : false,
          "ProductCFOPCategory" : "",
          "ProductIsExciseTaxRelevant" : false,
          "GoodsIssueUnit" : "",
          "GoodsIssueISOUnit" : "",
          "DistrCntrDistributionProfile" : "",
          "ProductIsCriticalPrt" : false,
          "ProductLogisticsHandlingGroup" : "",
          "ProductFreightGroup" : "",
          "OriginalBatchReferenceProduct" : "",
          "OriglBatchManagementIsRequired" : "",
          "BaseUnit" : "EA",
          "BaseISOUnit" : "EA",
          "ProductMinControlTemperature" : 0.00,
          "ProductMaxControlTemperature" : 0.00,
          "ProductControlTemperatureUnit" : "",
          "ProdCtrlTemperatureUnitISOCode" : "",
          "SAP__Messages" : [

          ]
        },
        {
          "@odata.etag" : "W/\"SADL-202601081448270000000C~20260108144827.0000000\"",
          "Product" : "04.037.125S",
          "Plant" : "BEV5",
          "ProfileCode" : "P3",
          "ProfileValidityStartDate" : "2025-01-01",
          "FiscalYearVariant" : "",
          "PeriodType" : "M",
          "ProfitCenter" : "H20011",
          "IsMarkedForDeletion" : false,
          "ConfigurableProduct" : "",
          "StockDeterminationGroup" : "",
          "IsBatchManagementRequired" : true,
          "SerialNumberProfile" : "",
          "IsNegativeStockAllowed" : false,
          "ProductCFOPCategory" : "",
          "ProductIsExciseTaxRelevant" : false,
          "GoodsIssueUnit" : "",
          "GoodsIssueISOUnit" : "",
          "DistrCntrDistributionProfile" : "",
          "ProductIsCriticalPrt" : false,
          "ProductLogisticsHandlingGroup" : "",
          "ProductFreightGroup" : "",
          "OriginalBatchReferenceProduct" : "",
          "OriglBatchManagementIsRequired" : "",
          "BaseUnit" : "EA",
          "BaseISOUnit" : "EA",
          "ProductMinControlTemperature" : 0.00,
          "ProductMaxControlTemperature" : 0.00,
          "ProductControlTemperatureUnit" : "",
          "ProdCtrlTemperatureUnitISOCode" : "",
          "SAP__Messages" : [

          ]
        },
        {
          "@odata.etag" : "W/\"SADL-202601081448270000000C~20260108144827.0000000\"",
          "Product" : "04.037.125S",
          "Plant" : "BEV7",
          "ProfileCode" : "",
          "ProfileValidityStartDate" : null,
          "FiscalYearVariant" : "",
          "PeriodType" : "M",
          "ProfitCenter" : "H20011",
          "IsMarkedForDeletion" : false,
          "ConfigurableProduct" : "",
          "StockDeterminationGroup" : "",
          "IsBatchManagementRequired" : true,
          "SerialNumberProfile" : "",
          "IsNegativeStockAllowed" : false,
          "ProductCFOPCategory" : "",
          "ProductIsExciseTaxRelevant" : false,
          "GoodsIssueUnit" : "",
          "GoodsIssueISOUnit" : "",
          "DistrCntrDistributionProfile" : "",
          "ProductIsCriticalPrt" : false,
          "ProductLogisticsHandlingGroup" : "",
          "ProductFreightGroup" : "",
          "OriginalBatchReferenceProduct" : "",
          "OriglBatchManagementIsRequired" : "",
          "BaseUnit" : "EA",
          "BaseISOUnit" : "EA",
          "ProductMinControlTemperature" : 0.00,
          "ProductMaxControlTemperature" : 0.00,
          "ProductControlTemperatureUnit" : "",
          "ProdCtrlTemperatureUnitISOCode" : "",
          "SAP__Messages" : [

          ]
        },
        {
          "@odata.etag" : "W/\"SADL-202601081448270000000C~20260108144827.0000000\"",
          "Product" : "04.037.125S",
          "Plant" : "NLV1",
          "ProfileCode" : "P3",
          "ProfileValidityStartDate" : "2025-01-01",
          "FiscalYearVariant" : "",
          "PeriodType" : "M",
          "ProfitCenter" : "H20011",
          "IsMarkedForDeletion" : false,
          "ConfigurableProduct" : "",
          "StockDeterminationGroup" : "",
          "IsBatchManagementRequired" : true,
          "SerialNumberProfile" : "",
          "IsNegativeStockAllowed" : false,
          "ProductCFOPCategory" : "",
          "ProductIsExciseTaxRelevant" : false,
          "GoodsIssueUnit" : "",
          "GoodsIssueISOUnit" : "",
          "DistrCntrDistributionProfile" : "",
          "ProductIsCriticalPrt" : false,
          "ProductLogisticsHandlingGroup" : "",
          "ProductFreightGroup" : "",
          "OriginalBatchReferenceProduct" : "",
          "OriglBatchManagementIsRequired" : "",
          "BaseUnit" : "EA",
          "BaseISOUnit" : "EA",
          "ProductMinControlTemperature" : 0.00,
          "ProductMaxControlTemperature" : 0.00,
          "ProductControlTemperatureUnit" : "",
          "ProdCtrlTemperatureUnitISOCode" : "",
          "SAP__Messages" : [

          ]
        }
      ],
      "_ProductSales" : {
        "@odata.etag" : "W/\"SADL-202601081448270000000C~20260108144827.0000000\"",
        "Product" : "04.037.125S",
        "SalesStatus" : "",
        "SalesStatusValidityDate" : null,
        "TransportationGroup" : "Z003",
        "PackagingProductType" : "",
        "AllowedPackagingWeightQty" : 0.000,
        "AllowedPackagingWeightQtyUnit" : "",
        "AllwdPackagingWeightQtyISOUnit" : "",
        "AllowedPackagingVolumeQty" : 0.000,
        "AllowedPackagingVolumeQtyUnit" : "",
        "AllwdPackagingVolumeQtyISOUnit" : "",
        "MaximumLevelByVolumeInPercent" : 0,
        "ExcessWeightToleranceValue" : 0.0,
        "PackggProductIsClosedPackaging" : false,
        "ProductStackingFactor" : 0,
        "ProdExcessVolumeToleranceValue" : 0.0,
        "SAP__Messages" : [

        ]
      },
      "_ProductSalesDelivery" : [
        {
          "Product" : "04.037.125S",
          "ProductSalesOrg" : "BE60",
          "ProductDistributionChnl" : "10",
          "MinimumOrderQuantity" : 0,
          "SupplyingPlant" : "BEV7",
          "PriceSpecificationProductGroup" : "",
          "AccountDetnProductGroup" : "01",
          "DeliveryNoteProcMinDelivQty" : 10,
          "ItemCategoryGroup" : "NORM",
          "DeliveryQuantityUnit" : "",
          "DeliveryQuantityISOUnit" : "",
          "DeliveryQuantity" : 0.000,
          "ProductSalesStatus" : "D2",
          "ProductSalesStatusValidityDate" : "2025-05-29",
          "SalesMeasureUnit" : "BX",
          "SalesMeasureISOUnit" : "BX",
          "IsMarkedForDeletion" : false,
          "FirstSalesSpecProductGroup" : "000",
          "SecondSalesSpecProductGroup" : "001",
          "ThirdSalesSpecProductGroup" : "002",
          "FourthSalesSpecProductGroup" : "001",
          "FifthSalesSpecProductGroup" : "Z01",
          "LogisticsStatisticsGroup" : "1",
          "VolumeRebateGroup" : "",
          "CashDiscountIsDeductible" : true,
          "RoundingProfile" : "",
          "VariableSalesUnitIsNotAllowed" : false,
          "ProductCommissionGroup" : "",
          "PricingReferenceProduct" : "04.037.125S",
          "ProductHasAttributeID01" : false,
          "ProductHasAttributeID02" : true,
          "ProductHasAttributeID03" : false,
          "ProductHasAttributeID04" : false,
          "ProductHasAttributeID05" : false,
          "ProductHasAttributeID06" : false,
          "ProductHasAttributeID07" : false,
          "ProductHasAttributeID08" : false,
          "ProductHasAttributeID09" : false,
          "ProductHasAttributeID10" : false,
          "ProdIsEntlmntRlvt" : false,
          "BaseUnit" : "EA",
          "ProductHierarchy" : "BEBQ0BQABQA1CQA1CB",
          "BaseISOUnit" : "EA",
          "ProductHierarchy1Desc" : "Belgium",
          "ProductHierarchy2Desc" : "Sutures",
          "ProductHierarchy3Desc" : "Absorbable sutures",
          "ProductHierarchy4Desc" : "Absorbable Regular Sutures",
          "ProductHierarchy5Desc" : "PDS Regular",
          "ProductSalesStatusDescription" : "Active Saleable",
          "FirstSalesSpecProductGroupDesc" : "MaterialGroup1-0",
          "SecondSalesSpecProductGroupDes" : "MaterialGroup2-1",
          "_ProductSalesTax" : [
            {
              "Product" : "04.037.125S",
              "Country" : "BE",
              "TaxCategory" : "ZVTX",
              "TaxClassification" : "1",
              "SAP__Messages" : [

              ]
            },
            {
              "Product" : "04.037.125S",
              "Country" : "BE",
              "TaxCategory" : "ZCM1",
              "TaxClassification" : "1",
              "SAP__Messages" : [

              ]
            },
            {
              "Product" : "04.037.125S",
              "Country" : "CH",
              "TaxCategory" : "ZVTX",
              "TaxClassification" : "1",
              "SAP__Messages" : [

              ]
            },
            {
              "Product" : "04.037.125S",
              "Country" : "LU",
              "TaxCategory" : "ZVTX",
              "TaxClassification" : "1",
              "SAP__Messages" : [

              ]
            },
            {
              "Product" : "04.037.125S",
              "Country" : "LU",
              "TaxCategory" : "ZCM1",
              "TaxClassification" : "1",
              "SAP__Messages" : [

              ]
            },
            {
              "Product" : "04.037.125S",
              "Country" : "NL",
              "TaxCategory" : "ZVTX",
              "TaxClassification" : "1",
              "SAP__Messages" : [

              ]
            },
            {
              "Product" : "04.037.125S",
              "Country" : "NL",
              "TaxCategory" : "ZCM1",
              "TaxClassification" : "1",
              "SAP__Messages" : [

              ]
            }
          ],
          "_ProductSalesText" : [
            {
              "Product" : "04.037.125S",
              "ProductSalesOrg" : "BE60",
              "ProductDistributionChnl" : "10",
              "Language" : "EN",
              "longtext" : " sales text in English for test - BE60 - TFNA Fem Nail ø11 le 125° L340 TiMo15 Basic data text in English for test. TFNA Fem Nail ø11 le 125° L340 TiMo15 Basic data text in English for test. TFNA Fem Nail ø11 le 125° L340 TiMo15 Basic data text in English for test. TFNA Fem Nail ø11 le 125° L340 TiMo15 Basic data text in English for test. TFNA Fem Nail ø11 le 125° L340 TiMo15 Basic data text in English for test. TFNA Fem Nail ø11 le 125° L340 TiMo15 Basic data text in English for test. TFNA Fem Nail ø11 le 125° L340 TiMo15 Basic data text in English for test"
            },
            {
              "Product" : "04.037.125S",
              "ProductSalesOrg" : "BE60",
              "ProductDistributionChnl" : "10",
              "Language" : "FR",
              "longtext" : " sales text in FR for test - BE60 - TFNA Fem Nail ø11 le 125° L340 TiMo15 Basic data text in English for test. TFNA Fem Nail ø11 le 125° L340 TiMo15 Basic data text in English for test. TFNA Fem Nail ø11 le 125° L340 TiMo15 Basic data text in English for test. TFNA Fem Nail ø11 le 125° L340 TiMo15 Basic data text in English for test. TFNA Fem Nail ø11 le 125° L340 TiMo15 Basic data text in English for test. TFNA Fem Nail ø11 le 125° L340 TiMo15 Basic data text in English for test. TFNA Fem Nail ø11 le 125° L340 TiMo15 Basic data text in English for test"
            },
            {
              "Product" : "04.037.125S",
              "ProductSalesOrg" : "BE60",
              "ProductDistributionChnl" : "10",
              "Language" : "DE",
              "longtext" : " sales text in DE for test - BE60 - TFNA Fem Nail ø11 le 125° L340 TiMo15 Basic data text in English for test. TFNA Fem Nail ø11 le 125° L340 TiMo15 Basic data text in English for test. TFNA Fem Nail ø11 le 125° L340 TiMo15 Basic data text in English for test. TFNA Fem Nail ø11 le 125° L340 TiMo15 Basic data text in English for test. TFNA Fem Nail ø11 le 125° L340 TiMo15 Basic data text in English for test. TFNA Fem Nail ø11 le 125° L340 TiMo15 Basic data text in English for test. TFNA Fem Nail ø11 le 125° L340 TiMo15 Basic data text in English for test"
            }
          ]
        }
      ],
      "_ProductUnitOfMeasure" : [
        {
          "@odata.etag" : "W/\"SADL-202601081448270000000C~20260108144827.0000000\"",
          "Product" : "04.037.125S",
          "AlternativeUnit" : "BX",
          "AlternativeSAPUnit" : "BX",
          "AlternativeISOUnit" : "BX",
          "QuantityNumerator" : 10,
          "QuantityDenominator" : 1,
          "ProductVolume" : 0.750,
          "VolumeUnit" : "M3",
          "VolumeISOUnit" : "MTQ",
          "GrossWeight" : 20.000,
          "WeightUnit" : "KG",
          "WeightISOUnit" : "KGM",
          "GlobalTradeItemNumber" : "07611819650351",
          "GlobalTradeItemNumberCategory" : "E5",
          "UnitSpecificProductLength" : 50.000,
          "UnitSpecificProductWidth" : 100.000,
          "UnitSpecificProductHeight" : 150.000,
          "ProductMeasurementUnit" : "CM",
          "ProductMeasurementISOUnit" : "CMT",
          "LowerLevelPackagingUnit" : "",
          "LowerLevelPackagingISOUnit" : "",
          "MaximumStackingFactor" : 0,
          "CapacityUsage" : 0.000,
          "BaseUnit" : "EA",
          "BaseISOUnit" : "EA",
          "SAP__Messages" : [

          ],
          "_ProductUnitOfMeasureEAN" : [
            {
              "@odata.etag" : "W/\"SADL-202601081448270000000C~20260108144827.0000000\"",
              "Product" : "04.037.125S",
              "AlternativeUnit" : "BX",
              "ConsecutiveNumber" : "00001",
              "AlternativeISOUnit" : "BX",
              "ProductStandardID" : "07611819650351",
              "InternationalArticleNumberCat" : "E5",
              "IsMainGlobalTradeItemNumber" : true,
              "SAP__Messages" : [

              ]
            }
          ]
        },
        {
          "@odata.etag" : "W/\"SADL-202601081448270000000C~20260108144827.0000000\"",
          "Product" : "04.037.125S",
          "AlternativeUnit" : "EA",
          "AlternativeSAPUnit" : "EA",
          "AlternativeISOUnit" : "EA",
          "QuantityNumerator" : 1,
          "QuantityDenominator" : 1,
          "ProductVolume" : 500.000,
          "VolumeUnit" : "CCM",
          "VolumeISOUnit" : "CMQ",
          "GrossWeight" : 2.000,
          "WeightUnit" : "KG",
          "WeightISOUnit" : "KGM",
          "GlobalTradeItemNumber" : "07611819650350",
          "GlobalTradeItemNumberCategory" : "IC",
          "UnitSpecificProductLength" : 5.000,
          "UnitSpecificProductWidth" : 10.000,
          "UnitSpecificProductHeight" : 15.000,
          "ProductMeasurementUnit" : "CM",
          "ProductMeasurementISOUnit" : "CMT",
          "LowerLevelPackagingUnit" : "",
          "LowerLevelPackagingISOUnit" : "",
          "MaximumStackingFactor" : 0,
          "CapacityUsage" : 0.000,
          "BaseUnit" : "EA",
          "BaseISOUnit" : "EA",
          "SAP__Messages" : [

          ],
          "_ProductUnitOfMeasureEAN" : [
            {
              "@odata.etag" : "W/\"SADL-202601081448270000000C~20260108144827.0000000\"",
              "Product" : "04.037.125S",
              "AlternativeUnit" : "EA",
              "ConsecutiveNumber" : "00001",
              "AlternativeISOUnit" : "EA",
              "ProductStandardID" : "07611819650350",
              "InternationalArticleNumberCat" : "IC",
              "IsMainGlobalTradeItemNumber" : true,
              "SAP__Messages" : [

              ]
            }
          ]
        },
        {
          "@odata.etag" : "W/\"SADL-202601081448270000000C~20260108144827.0000000\"",
          "Product" : "04.037.125S",
          "AlternativeUnit" : "KAR",
          "AlternativeSAPUnit" : "KAR",
          "AlternativeISOUnit" : "CT",
          "QuantityNumerator" : 50,
          "QuantityDenominator" : 1,
          "ProductVolume" : 6.000,
          "VolumeUnit" : "M3",
          "VolumeISOUnit" : "MTQ",
          "GrossWeight" : 100.000,
          "WeightUnit" : "KG",
          "WeightISOUnit" : "KGM",
          "GlobalTradeItemNumber" : "07611819650352",
          "GlobalTradeItemNumberCategory" : "E5",
          "UnitSpecificProductLength" : 100.000,
          "UnitSpecificProductWidth" : 200.000,
          "UnitSpecificProductHeight" : 300.000,
          "ProductMeasurementUnit" : "CM",
          "ProductMeasurementISOUnit" : "CMT",
          "LowerLevelPackagingUnit" : "",
          "LowerLevelPackagingISOUnit" : "",
          "MaximumStackingFactor" : 0,
          "CapacityUsage" : 0.000,
          "BaseUnit" : "EA",
          "BaseISOUnit" : "EA",
          "SAP__Messages" : [

          ],
          "_ProductUnitOfMeasureEAN" : [
            {
              "@odata.etag" : "W/\"SADL-202601081448270000000C~20260108144827.0000000\"",
              "Product" : "04.037.125S",
              "AlternativeUnit" : "KAR",
              "ConsecutiveNumber" : "00001",
              "AlternativeISOUnit" : "CT",
              "ProductStandardID" : "07611819650352",
              "InternationalArticleNumberCat" : "E5",
              "IsMainGlobalTradeItemNumber" : true,
              "SAP__Messages" : [

              ]
            }
          ]
        }
      ],
      "_ProductValuation" : [
        {
          "@odata.etag" : "W/\"SADL-202601081448270000000C~20260108144827.0000000\"",
          "Product" : "04.037.125S",
          "ValuationArea" : "BEV7",
          "ValuationType" : "",
          "ValuationClass" : "7920",
          "PriceDeterminationControl" : "3",
          "StandardPrice" : 5000.00,
          "ProductPriceUnitQuantity" : 1,
          "InventoryValuationProcedure" : "S",
          "MovingAveragePrice" : 0.00,
          "ValuationCategory" : "",
          "ProductUsageType" : "",
          "ProductOriginType" : "",
          "IsProducedInhouse" : false,
          "IsMarkedForDeletion" : false,
          "ValuationClassSalesOrderStock" : "",
          "ProjectStockValuationClass" : "",
          "Currency" : "EUR",
          "BaseUnit" : "EA",
          "BaseISOUnit" : "EA",
          "SAP__Messages" : [

          ]
        },
        {
          "@odata.etag" : "W/\"SADL-202601081448270000000C~20260108144827.0000000\"",
          "Product" : "04.037.125S",
          "ValuationArea" : "NLN1",
          "ValuationType" : "",
          "ValuationClass" : "7920",
          "PriceDeterminationControl" : "",
          "StandardPrice" : 5000.00,
          "ProductPriceUnitQuantity" : 1,
          "InventoryValuationProcedure" : "S",
          "MovingAveragePrice" : 0.00,
          "ValuationCategory" : "",
          "ProductUsageType" : "",
          "ProductOriginType" : "",
          "IsProducedInhouse" : false,
          "IsMarkedForDeletion" : false,
          "ValuationClassSalesOrderStock" : "",
          "ProjectStockValuationClass" : "",
          "Currency" : "EUR",
          "BaseUnit" : "EA",
          "BaseISOUnit" : "EA",
          "SAP__Messages" : [

          ]
        },
        {
          "@odata.etag" : "W/\"SADL-202601081448270000000C~20260108144827.0000000\"",
          "Product" : "04.037.125S",
          "ValuationArea" : "NLV1",
          "ValuationType" : "",
          "ValuationClass" : "7920",
          "PriceDeterminationControl" : "3",
          "StandardPrice" : 5000.00,
          "ProductPriceUnitQuantity" : 1,
          "InventoryValuationProcedure" : "S",
          "MovingAveragePrice" : 0.00,
          "ValuationCategory" : "",
          "ProductUsageType" : "",
          "ProductOriginType" : "",
          "IsProducedInhouse" : false,
          "IsMarkedForDeletion" : false,
          "ValuationClassSalesOrderStock" : "",
          "ProjectStockValuationClass" : "",
          "Currency" : "EUR",
          "BaseUnit" : "EA",
          "BaseISOUnit" : "EA",
          "SAP__Messages" : [

          ]
        },
        {
          "@odata.etag" : "W/\"SADL-202601081448270000000C~20260108144827.0000000\"",
          "Product" : "04.037.125S",
          "ValuationArea" : "BEV5",
          "ValuationType" : "",
          "ValuationClass" : "7920",
          "PriceDeterminationControl" : "3",
          "StandardPrice" : 5000.00,
          "ProductPriceUnitQuantity" : 1,
          "InventoryValuationProcedure" : "S",
          "MovingAveragePrice" : 0.00,
          "ValuationCategory" : "",
          "ProductUsageType" : "",
          "ProductOriginType" : "",
          "IsProducedInhouse" : false,
          "IsMarkedForDeletion" : false,
          "ValuationClassSalesOrderStock" : "",
          "ProjectStockValuationClass" : "",
          "Currency" : "EUR",
          "BaseUnit" : "EA",
          "BaseISOUnit" : "EA",
          "SAP__Messages" : [

          ]
        }
      ],
      "_ProductValuationAccounting" : [
        {
          "@odata.etag" : "W/\"SADL-202601081448270000000C~20260108144827.0000000\"",
          "Product" : "04.037.125S",
          "ValuationArea" : "BEV7",
          "ValuationType" : "",
          "CommercialPrice1InCoCodeCrcy" : 0.00,
          "CommercialPrice2InCoCodeCrcy" : 0.00,
          "CommercialPrice3InCoCodeCrcy" : 0.00,
          "DevaluationYearCount" : "0",
          "FuturePrice" : 5500.00,
          "FuturePriceValidityStartDate" : "2026-01-01",
          "LIFOValuationPoolNumber" : "",
          "TaxPricel1InCoCodeCrcy" : 0.00,
          "TaxPrice2InCoCodeCrcy" : 0.00,
          "TaxPrice3InCoCodeCrcy" : 0.00,
          "TaxBasedPricesPriceUnitQty" : 0,
          "IsLIFOAndFIFORelevant" : false,
          "Currency" : "EUR",
          "BaseUnit" : "EA",
          "BaseISOUnit" : "EA",
          "SAP__Messages" : [

          ]
        },
        {
          "@odata.etag" : "W/\"SADL-202601081448270000000C~20260108144827.0000000\"",
          "Product" : "04.037.125S",
          "ValuationArea" : "NLN1",
          "ValuationType" : "",
          "CommercialPrice1InCoCodeCrcy" : 0.00,
          "CommercialPrice2InCoCodeCrcy" : 0.00,
          "CommercialPrice3InCoCodeCrcy" : 0.00,
          "DevaluationYearCount" : "0",
          "FuturePrice" : 0.00,
          "FuturePriceValidityStartDate" : null,
          "LIFOValuationPoolNumber" : "",
          "TaxPricel1InCoCodeCrcy" : 0.00,
          "TaxPrice2InCoCodeCrcy" : 0.00,
          "TaxPrice3InCoCodeCrcy" : 0.00,
          "TaxBasedPricesPriceUnitQty" : 0,
          "IsLIFOAndFIFORelevant" : false,
          "Currency" : "EUR",
          "BaseUnit" : "EA",
          "BaseISOUnit" : "EA",
          "SAP__Messages" : [

          ]
        },
        {
          "@odata.etag" : "W/\"SADL-202601081448270000000C~20260108144827.0000000\"",
          "Product" : "04.037.125S",
          "ValuationArea" : "NLV1",
          "ValuationType" : "",
          "CommercialPrice1InCoCodeCrcy" : 0.00,
          "CommercialPrice2InCoCodeCrcy" : 0.00,
          "CommercialPrice3InCoCodeCrcy" : 0.00,
          "DevaluationYearCount" : "0",
          "FuturePrice" : 0.00,
          "FuturePriceValidityStartDate" : null,
          "LIFOValuationPoolNumber" : "",
          "TaxPricel1InCoCodeCrcy" : 0.00,
          "TaxPrice2InCoCodeCrcy" : 0.00,
          "TaxPrice3InCoCodeCrcy" : 0.00,
          "TaxBasedPricesPriceUnitQty" : 0,
          "IsLIFOAndFIFORelevant" : false,
          "Currency" : "EUR",
          "BaseUnit" : "EA",
          "BaseISOUnit" : "EA",
          "SAP__Messages" : [

          ]
        },
        {
          "@odata.etag" : "W/\"SADL-202601081448270000000C~20260108144827.0000000\"",
          "Product" : "04.037.125S",
          "ValuationArea" : "BEV5",
          "ValuationType" : "",
          "CommercialPrice1InCoCodeCrcy" : 0.00,
          "CommercialPrice2InCoCodeCrcy" : 0.00,
          "CommercialPrice3InCoCodeCrcy" : 0.00,
          "DevaluationYearCount" : "0",
          "FuturePrice" : 0.00,
          "FuturePriceValidityStartDate" : null,
          "LIFOValuationPoolNumber" : "",
          "TaxPricel1InCoCodeCrcy" : 0.00,
          "TaxPrice2InCoCodeCrcy" : 0.00,
          "TaxPrice3InCoCodeCrcy" : 0.00,
          "TaxBasedPricesPriceUnitQty" : 0,
          "IsLIFOAndFIFORelevant" : false,
          "Currency" : "EUR",
          "BaseUnit" : "EA",
          "BaseISOUnit" : "EA",
          "SAP__Messages" : [

          ]
        }
      ],
      "_ZZ1ProductChar" : [
        {
          "Product" : "04.037.125S",
          "ClassType" : "001",
          "CharcInternalID" : "807",
          "CharcValuePositionNumber" : "1",
          "CharcDataType" : "CHAR",
          "CharcValue" : "I",
          "CharcNumericValue" : 0.00000000000000,
          "Characteristic" : "FINANCE_CLASSIFICATION",
          "CharcValueDescription" : "Inventory"
        },
        {
          "Product" : "04.037.125S",
          "ClassType" : "001",
          "CharcInternalID" : "811",
          "CharcValuePositionNumber" : "1",
          "CharcDataType" : "CHAR",
          "CharcValue" : "HUMAN",
          "CharcNumericValue" : 0.00000000000000,
          "Characteristic" : "SELLING_PROCESS",
          "CharcValueDescription" : "Human"
        },
        {
          "Product" : "04.037.125S",
          "ClassType" : "001",
          "CharcInternalID" : "813",
          "CharcValuePositionNumber" : "1",
          "CharcDataType" : "CHAR",
          "CharcValue" : "Y",
          "CharcNumericValue" : 0.00000000000000,
          "Characteristic" : "STERILE",
          "CharcValueDescription" : "Yes"
        },
        {
          "Product" : "04.037.125S",
          "ClassType" : "001",
          "CharcInternalID" : "815",
          "CharcValuePositionNumber" : "1",
          "CharcDataType" : "CHAR",
          "CharcValue" : "IMPLANT",
          "CharcNumericValue" : 0.00000000000000,
          "Characteristic" : "TYPE_OF_MATERIAL",
          "CharcValueDescription" : "Implant"
        }
      ]
    }
  ]
}

mapping(payload)
