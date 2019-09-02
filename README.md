# US Disaster Spending: A Look at the Numbers
By: David Kling, Michael Magliaro, and Benjamin Eck

[The deployed product](https://usdisasterspending.herokuapp.com/)


#### What we show:
As of June 2019 there have been 34 disasters declared by the Federal Government across the US. In recent years, records have been set for the number of federal disasters declared as well as for the amount that the Federal Emergency Management Agency has paid out of the disaster relief fund for restitution and prevention.

This repository provides an overall country and state by state graphical analysis which depicts trending of disasters across the US as well as the funding FEMA has paid out for public assistance, individual assistance and hazard mitigation.

![Federal Page](https://github.com/EckBen/US-Disaster-Spending/blob/master/Images/federalRestyled.png)

The home, or Federal, page provides a line chart to show how many disaster there have been since 2000 and how much was spent each year on disaster relief. There is a slider at the bottom of the chart to select a specific date range for a zoomed view.
There are also two bar charts, one showing the number of indiviual projects that were created, by damage type, in this time period and the other showing the cost of those repairs by damage type.

![State Page](https://github.com/EckBen/US-Disaster-Spending/blob/master/Images/stateRestyled.png)

The second, or State, page shows a country map. When one of the states are clicked, the page scrolls to a newly generated state map and radar chart. The state map contains a county level choropleth depicting the average amount of money spent per disaster. The radar chart shows the proportion of money spent and the proportion of total disasters by disaster type to visualize the dispropationate spending on, and therfore costly nature of, different disaster types.

![Data Exploration Page](https://github.com/EckBen/US-Disaster-Spending/blob/master/Images/dataExplorationRestyled.png)

The final, or Data Exploration, page contains a table of the raw data used for these visualizations. The dataset is limited to showing the first 1,000 records returned for performance concerns. The data is filterable on each column to show subsets of the data.


#### Our Datasets:
- [OpenFEMA Public Assistance Funded Projects Details](https://www.fema.gov/openfema-dataset-public-assistance-funded-projects-summaries-v1)
- [OpenFEMA Disaster Declarations Summaries](https://www.fema.gov/openfema-dataset-disaster-declarations-summaries-v1)
- [FEMA Web Disaster Summaries](https://www.fema.gov/openfema-dataset-fema-web-disaster-summaries-v1)
