source('01a_data_prep.r')

# parameters
total_glb = 432
max_perception = 2*total_glb

# get all possible proportions
proportions = matrix(0, nrow = max_perception, ncol = max_perception)
for (i in 1:max_perception) {
  for (j in 1:max_perception) {
    proportions[i,j] = (i-1)/((i-1) + (j-1))
  }
}

predictions_proportional_ANS = function(w, epsilon = 0.05, total = total_glb, max_perception = 2 * total) {
  
  # get simple confusion probabilities
  ANS_confusion = matrix(0, nrow = total, ncol = max_perception)
  for (i in 1:total) {
    for (j in 1:max_perception) {
      ANS_confusion[i,j] = dnorm(j-1, mean = max(c(i-1,0.01)), sd = w * max(c(i-1,0.01))) 
    }
  }
  ANS_confusion = prop.table(ANS_confusion, 1)
  
  predictions = matrix(0, nrow = total, ncol = total)
  for (k in 1:nrow(predictions)) {
    true_red = k-1
    
    # get probabilities of perceiving a proportion
    probability_perceived_proportion = matrix(0, nrow = max_perception, ncol = max_perception)
    for (i in 1:max_perception) {
      for (j in 1:max_perception) {
        probability_perceived_proportion[i,j] = ANS_confusion[true_red+1, i] * ANS_confusion[total-true_red, j]
      }
    }
    probability_perceived_proportion = probability_perceived_proportion / sum(probability_perceived_proportion)
    
    ## probability of realizing slider answer k in {0, ..., 432}
    ## obtained from looking at all possible proportions which are epsilon-close to k
    ## then summing their probabilities
    predictions[k,] = map_dbl(0:(total-1), 
                                 function(x) {
                                   sum(probability_perceived_proportion[which(abs(proportions - x/(total-1)) < epsilon)])
                                 } )
  }
  prop.table(predictions,1)
}

pred_prop = predictions_proportional_ANS(0.1, epsilon = 0.01)
plot(pred_prop[100,]) %>% show()

## this has obnoxious running times; postpone fitting this model to the data!!
