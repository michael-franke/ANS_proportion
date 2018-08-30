source('01a_data_prep.r')

total_glb = 432

get_confusion = function(weber_fraction = 0.1, ns = total_glb) {
  states = 0:ns
  sigma = sapply(states, function(n) weber_fraction * max(n,0.1))
  number_confusion_probs = matrix(0, ns+1, ns+1, dimnames = list(states, states))
  for (n in states) {
    for (m in states) {
      number_confusion_probs[n+1, m+1] = pnorm(m+0.5, n, sigma[n+1]) - pnorm(m-0.5, n, sigma[n+1])
    }
  }
  ### this ensures that values close to the maximum are treated as values close to the minimum
  scene_confusion_probs = matrix(0, ns+1, ns+1, dimnames = list(states,states))
  for (n in states) {
    for (m in states) {
      scene_confusion_probs[n+1, m+1] = number_confusion_probs[n+1,m+1] * number_confusion_probs[ns-n+1,ns-m+1]
    }
  }
  scene_confusion_probs = prop.table(scene_confusion_probs,1)
  return(scene_confusion_probs) 
}
# C = get_confusion(2)
# qplot(0:total_glb, C[2,]) + geom_point()

d_true = filter(d, outlier ==0)$dots_number
d_response = filter(d, outlier ==0)$rating_slider

# we are going to minimize the negative log likelihood 
# after Laplace-smoothing the predictions (to make it less susceptible to outliers)
get_error = function(w) {
  C = get_confusion(w)
  error = map_dbl(1:length(d_true) , function(i) {
    actual= d_true[i]
    resp = d_response[i]
    pred = C[actual+1,] + 0.1
    pred = pred/sum(pred)
    log(pred[resp+1])
  })
  -sum(error)
}

get_error2 = function(par) {
  w = par[1]
  eps = par[2]
  C = get_confusion(w)
  # if (w <=0 | eps <= 0 | eps >=1) {
  #   return -Inf
  # }
  error = map_dbl(1:length(d_true) , function(i) {
    actual= d_true[i]
    resp = d_response[i]
    pred = C[actual+1,] + eps
    pred = pred/sum(pred)
    log(pred[resp+1])
  })
  -sum(error)
}

opt_fit = optimize(f = get_error, interval = c(0,1))
opt_fit2 = optim(c(0.4,0.01), fn = get_error2)
