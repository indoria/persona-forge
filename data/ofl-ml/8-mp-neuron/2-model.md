# Model

> A model is **our approximation** of **true relationship** between input and output
>
> A model is **our estimation** of **ground reality**

## To define a model we need (What it means to specify a model)
- The function
- It's prameters (which are to be *learned* from some data)
- What kind of inputs does this function take
- What kind of outputs does this function produces

# MP Neuron
- y = f(g(x)) > b; g(x) = sum(xi) [where i = 0 to n]
- b : parameter to be learned
- Takes in boolean
- Outputs boolean

![Mathematical Model](data/ml-ofl/8-mp-neuron/image.png)


## Summary
```
Data : Binary (0, 1 OR true, false)
Task : Classification
Model : y(g(x)) - b > 0 where g(x) = sum(xi)
Loss : Squared error loss sum(yi - ypi)^2
Learning : Brute force (possible values of b are from 0 to n)
Evaluate : Accuracy (correct / total)
```

![Summary](data/ml-ofl/8-mp-neuron/image-1.png)

![Overview](data/ml-ofl/8-mp-neuron/image-2.png)