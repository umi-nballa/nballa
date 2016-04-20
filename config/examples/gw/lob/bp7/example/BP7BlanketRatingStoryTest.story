Meta: 
@Jira PC-21733
Scenario: Calculate premium for coverages inside a blanket

Given a basic submission
And I add a building with a classification
And I create a blanket of type <blanket_type>
When we quote
Then the blanket average rate is <blanket_average_rate>
And the blanketed building premium is <blanketed_building_premium>
And the blanketed classification premium is <blanketed_classification_premium>

Examples:
|blanket_type                                     |blanket_average_rate |blanketed_building_premium |blanketed_classification_premium |
|Building Only                                    |0.462                |924                        |0                                |
|Business Personal Property Only                  |1.140                |0                          |228                              |
|Building and Business Personal Property Combined |0.524                |924                        |228                              |