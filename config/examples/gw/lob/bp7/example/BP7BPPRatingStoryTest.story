Meta: 
@Jira PC-21729
@Jira PC-21858
Scenario: Calculate premium for BPP coverage

Given a basic submission
And property type is <property_type>
And classification description is <class_description>
And BPP limit is <bpp_limit>
When we quote
Then the BPP premium is <bpp_premium>

Examples:
 |property_type |class_description                          |bpp_limit |bpp_premium |
 |Apartment     |Over 4 Fam Office Occup                    |10000     |54          |
 |Apartment     |Townhouse-Over 4 Fam, Merc or Office Occup |50000     |154         |
 |Office        |Lawyers-Lessor Risk Only                   |65000     |253         |
