<?xml version="1.0"?>

<xsl:stylesheet version="1.0"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

    <xsl:template match="/">

        <html>
            <head>
                <style>
                    table, th, td {
                    border: 1px solid black;
                    }

                </style>
            </head>
            <body>
                <h2>Books Tables</h2>
                <xsl:for-each select="users/user">
                    <h3>
                        <xsl:value-of select="username" />
                    </h3>
                    <table>
                        <tr>
                            <th>Name</th>
                            <th>Author</th>
                            <th>Publication Date</th>
                            <th>Language</th>
                            <th>Category</th>
                        </tr>
                        <xsl:for-each
                            select="books/book">
                            <tr>
                                <td>
                                    <xsl:value-of select="name" />
                                </td>
                                <td>
                                    <xsl:value-of select="author" />
                                </td>
                                <td>
                                    <xsl:value-of select="pubDate" />
                                </td>
                                <td>
                                    <xsl:value-of select="language" />
                                </td>
                                <td>
                                    <xsl:value-of select="category" />
                                </td>
                            </tr></xsl:for-each>
                    </table>
                </xsl:for-each>
            </body>
        </html>
    </xsl:template>

</xsl:stylesheet><!--
Stylus Studio meta-information - (c) 2004-2006. Progress Software Corporation. All rights reserved.
<metaInformation>
<scenarios ><scenario default="yes" name="Scenario1" userelativepaths="yes" externalpreview="no"
url="..\users\users.xml" htmlbaseurl="" outputurl="" processortype="internal" useresolver="yes"
profilemode="0" profiledepth="" profilelength="" urlprofilexml="" commandline="" additionalpath=""
additionalclasspath="" postprocessortype="none" postprocesscommandline=""
postprocessadditionalpath="" postprocessgeneratedext="" validateoutput="no" validator="internal"
customvalidator=""/></scenarios><MapperMetaTag><MapperInfo srcSchemaPathIsRelative="yes"
srcSchemaInterpretAsXML="no" destSchemaPath="" destSchemaRoot="" destSchemaPathIsRelative="yes"
destSchemaInterpretAsXML="no"/><MapperBlockPosition></MapperBlockPosition><TemplateContext></TemplateContext><MapperFilter
side="source"></MapperFilter></MapperMetaTag>
</metaInformation>
-->