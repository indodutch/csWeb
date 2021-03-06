"use strict";

angular.module("mockedOWSXML", []).value("defaultXML",
"<?xml version='1.0' encoding='UTF-8'?>" +
"<WMS_Capabilities version='1.3.0' updateSequence='386' xmlns='http://www.opengis.net/wms' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance' xsi:schemaLocation='http://www.opengis.net/wms https://simcity.amsterdam-complexity.nl/geoserver/schemas/wms/1.3.0/capabilities_1_3_0.xsd'>" +
"  <Service></Service>" +
"  <Capability>" +
"    <Request>" +
"    </Request>" +
"    <Exception>" +
"    </Exception>" +
"    <Layer>" +
"      <Title>GeoServer Web Map Service</Title>" +
"      <Abstract>Dummy WMS file</Abstract>" +
"      <EX_GeographicBoundingBox>" +
"      </EX_GeographicBoundingBox>" +
"      <BoundingBox CRS='CRS:84' minx='76.590216' miny='11.912658' maxx='78.590216' maxy='13.912658'/>" +
"      <Layer queryable='1' opaque='0'>" +
"        <Name>Layer 1</Name>" +
"        <Title>Layer 1</Title>" +
"        <Abstract/>" +
"        <KeywordList>" +
"        </KeywordList>" +
"        <EX_GeographicBoundingBox>" +
"        </EX_GeographicBoundingBox>" +
"        <BoundingBox CRS='CRS:84' minx='77.5157852172852' miny='12.9011240005493' maxx='77.6719284057617' maxy='13.0851802825928'/>" +
"        <BoundingBox CRS='EPSG:4326' minx='12.9011240005493' miny='77.5157852172852' maxx='13.0851802825928' maxy='77.6719284057617'/>" +
"        <Style>" +
"          <Name>line</Name>" +
"          <Title>Default Line</Title>" +
"          <Abstract>A sample style that draws a line</Abstract>" +
"          <LegendURL width='20' height='20'>" +
"            <Format>image/png</Format>" +
"            <OnlineResource xmlns:xlink='http://www.w3.org/1999/xlink' xlink:type='simple' xlink:href='https://simcity.amsterdam-complexity.nl/geoserver/Bangalore/ows?service=WMS&amp;request=GetLegendGraphic&amp;format=image%2Fpng&amp;width=20&amp;height=20&amp;layer=all_road'/>" +
"          </LegendURL>" +
"        </Style>" +
"      </Layer>" +
"      <Layer queryable='1' opaque='0'>" +
"        <Name>Layer 2</Name>" +
"        <Title>Layer 2</Title>" +
"        <Abstract/>" +
"        <KeywordList>" +
"        </KeywordList>" +
"        <EX_GeographicBoundingBox>" +
"        </EX_GeographicBoundingBox>" +
"        <BoundingBox CRS='CRS:84' minx='77.5157852172852' miny='12.9011240005493' maxx='77.6719284057617' maxy='13.0851802825928'/>" +
"        <BoundingBox CRS='EPSG:4326' minx='12.9011240005493' miny='77.5157852172852' maxx='13.0851802825928' maxy='77.6719284057617'/>" +
"        <Style>" +
"          <Name>line</Name>" +
"          <Title>Default Line</Title>" +
"          <Abstract>A sample style that draws a line</Abstract>" +
"          <LegendURL width='20' height='20'>" +
"            <Format>image/png</Format>" +
"            <OnlineResource xmlns:xlink='http://www.w3.org/1999/xlink' xlink:type='simple' xlink:href='https://simcity.amsterdam-complexity.nl/geoserver/Bangalore/ows?service=WMS&amp;request=GetLegendGraphic&amp;format=image%2Fpng&amp;width=20&amp;height=20&amp;layer=all_road'/>" +
"          </LegendURL>" +
"        </Style>" +
"      </Layer>" +
"      <Layer queryable='1' opaque='0'>" +
"        <Name>Layer 3</Name>" +
"        <Title>Layer 3</Title>" +
"        <Abstract/>" +
"        <KeywordList>" +
"        </KeywordList>" +
"        <EX_GeographicBoundingBox>" +
"        </EX_GeographicBoundingBox>" +
"        <BoundingBox CRS='CRS:84' minx='77.5157852172852' miny='12.9011240005493' maxx='77.6719284057617' maxy='13.0851802825928'/>" +
"        <BoundingBox CRS='EPSG:4326' minx='12.9011240005493' miny='77.5157852172852' maxx='13.0851802825928' maxy='77.6719284057617'/>" +
"        <Style>" +
"          <Name>line</Name>" +
"          <Title>Default Line</Title>" +
"          <Abstract>A sample style that draws a line</Abstract>" +
"          <LegendURL width='20' height='20'>" +
"            <Format>image/png</Format>" +
"            <OnlineResource xmlns:xlink='http://www.w3.org/1999/xlink' xlink:type='simple' xlink:href='https://simcity.amsterdam-complexity.nl/geoserver/Bangalore/ows?service=WMS&amp;request=GetLegendGraphic&amp;format=image%2Fpng&amp;width=20&amp;height=20&amp;layer=all_road'/>" +
"          </LegendURL>" +
"        </Style>" +
"      </Layer>" +
"    </Layer>" +
"  </Capability>" +
"</WMS_Capabilities>"
);
