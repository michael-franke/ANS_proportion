library(tidyverse)

d = read_csv("data.csv")

d %>% group_by(worker_id) %>% count()

d = filter(d, submission_id != 26) # remove double submission

# remove outliers
## in each block (18 numbers) look at the outliers (2sds)

d = d %>% mutate(interval = dots_number %/% 18 %>% as.factor()) %>% 
  group_by(interval) %>% 
  mutate(interval_mean = mean(rating_slider),
         interval_sd =sd(rating_slider)) %>% 
  ungroup() %>% 
  mutate(outlier = ifelse(abs(interval_mean - rating_slider) >= 2*interval_sd, 1, 0))

# visualize outliers
ggplot(d, aes(x = dots_number, y = rating_slider, color = outlier)) + geom_point()
