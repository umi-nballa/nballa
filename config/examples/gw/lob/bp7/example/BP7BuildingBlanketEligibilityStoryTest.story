Meta: 
@Jira PC-21448
Scenario: Verify building blanket eligibility

Given an empty BP7 submission
And I create a blanket of type <blanket_type>
When I create a building
And I select the coverage Building
And I set the Building valuation to <valuation>
Then the building is <blanket_eligible> to be put in the blanket

Examples:
|valuation            |blanket_type                                     |blanket_eligible|
|Actual Cash Value    |Business Personal Property Only                  |not eligible    |
|Replacement Cost     |Business Personal Property Only                  |not eligible    |
|Functional Valuation |Business Personal Property Only                  |not eligible    |
|Actual Cash Value    |Building and Business Personal Property Combined |eligible        |
|Replacement Cost     |Building and Business Personal Property Combined |eligible        |
|Functional Valuation |Building and Business Personal Property Combined |not eligible    |
|Actual Cash Value    |Building Only                                    |eligible        |
|Replacement Cost     |Building Only                                    |eligible        |
|Functional Valuation |Building Only                                    |not eligible    |
