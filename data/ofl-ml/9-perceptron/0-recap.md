# Perceptron


## Recap
- Our job as machine learning practitioner is to find functions which capture the relationship between input and output.
- These functions would have some parameters (weights and biases). Our next job is to "learn" it's parameters.
- For MP neuron, there was just one parameter. "Learning" was done via brute force, vary "b" from 0 to "n" (number of features, every feature had boolean value).


![Overview](data/ml-ofl/9-perceptron/image.png)


## Data (preparation)

newVal = (maxVal - oldVal) / (maxVal - minVal)
newVal => move origin to least value => squeeze the axis so that all data fit within 0 to 1