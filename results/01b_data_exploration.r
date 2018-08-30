source('01a_data_prep.r')

ggplot(filter(d, trial_type == "main"), 
       aes(x = dots_number, y = rating_slider)) + 
  geom_point() + 
  facet_wrap(~ submission_id) + 
  geom_abline(slope = 1, intercept = 0, color = "gray")
# 24 and 30 seem to be outliers/strange

