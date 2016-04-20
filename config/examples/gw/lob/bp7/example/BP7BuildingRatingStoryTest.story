Meta: 
@Jira PC-21729
Scenario: Calculate premium for Building coverage

Given a basic submission
And property type is <property_type>
And classification description is <class_description>
And Building limit is <building_limit>
When we quote
Then the Building premium is <building_premium>

Examples:
|property_type |class_description                          |building_limit |building_premium |
|Apartment     |Over 4 Fam Office Occup                    |100000         |462              |
|Apartment     |Townhouse-Over 4 Fam, Merc or Office Occup |500000         |1155             |
|Office        |Lawyers-Lessor Risk Only                   |650000         |1372             |
|Contractor    |Interior Decorators-Shop                   |350000         |1271             |
|Contractor    |Interior Decorators-Shop                   |315000         |1200             |
