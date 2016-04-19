Meta:
@Jira PC-21448
Scenario: Verify classification blanket eligibility

Given an empty BP7 submission
And I create a blanket of type <blanket_type>
When I create a classification
And I select the coverage Business Personal Property
Then the classification is <blanket_eligible> to be put in the blanket

Examples:
|blanket_type                                     |blanket_eligible|
|Business Personal Property Only                  |eligible        |
|Building and Business Personal Property Combined |eligible        |
|Building Only                                    |not eligible    |
